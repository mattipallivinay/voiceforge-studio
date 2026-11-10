
from pathlib import Path
from gnani.tts.client import GnaniTTSClient, AudioConfig
from fastapi import HTTPException
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import uuid
import zipfile
from io import BytesIO
from groq import Groq
load_dotenv()

GNANI_API_KEY = os.getenv("GNANI_API_KEY", "")

GNANI_TTS_BASE_URL = os.getenv(
    "GNANI_TTS_BASE_URL",
    "https://api.vachana.ai",
)
GNANI_TTS_MODEL = os.getenv("GNANI_TTS_MODEL", "timbre-v2.5")
APP_ENV = os.getenv("APP_ENV", "development")

app = FastAPI(
    title="VoiceForge Studio API",
    description="AI-powered voice production for content creators",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class ScriptRequest(BaseModel):
    idea: str = Field(min_length=3, max_length=2000)
    genre: str = "drama"
    language: str = "English"
    characters: int = Field(default=2, ge=1, le=10)
    voice_selections: dict[int, str] = Field(
        default_factory=lambda: {
            1: "Pranav",
            2: "Girish",
        }
    )
    character_profiles: dict[int, dict[str, str]] = Field(
        default_factory=lambda: {
            1: {"name": "Character 1", "role": "Hero"},
            2: {"name": "Character 2", "role": "Villain"},
        }
    )


class AudioRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    voice: str = "Pranav"
    language: str = "en-IN"
    speed: float = Field(default=1.0, ge=0.5, le=2.0)


class DialogueAudioRequest(BaseModel):
    character: str
    text: str = Field(min_length=1, max_length=2000)
    voice: str
    language: str = "en-IN"
    speed: float = Field(default=1.0, ge=0.5, le=2.0)


class BatchAudioRequest(BaseModel):
    dialogue: list[DialogueAudioRequest] = Field(
        min_length=1,
        max_length=30,
    )


@app.get("/")
def home():
    return {
        "message": "Welcome to VoiceForge Studio!",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/script/plan")
def plan_script(request: ScriptRequest):
    import json
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured."
        )

    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        prompt = f"""
Create an engaging short story script for a voice-generation application.

Story idea: {request.idea}
Genre: {request.genre}
Language: {request.language}
Number of characters: {request.characters}
Character profiles:
{json.dumps(request.character_profiles, indent=2)}

Important character instructions:
- Use the exact custom name specified for each character.
- Follow each character's assigned role.
- Do not invent additional characters.
- Keep character names consistent throughout the dialogue.

Requirements:
- Create a short, coherent story with a beginning, conflict, and ending.
- Use exactly {request.characters} distinct characters.
- Write all dialogue in {request.language}.
- Assign each character a suitable voice.
- Use Pranav for a male hero, Girish for a male villain,
  and Kaveri for a narrator when those roles are present.
- For other characters, choose an appropriate voice.
- Include a narrator only if it fits the requested character count.
- Return valid JSON only, with this structure:
{{
  "title": "Story title",
  "genre": "{request.genre}",
  "language": "{request.language}",
  "dialogue": [
    {{
      "character": "Character name",
      "text": "Spoken dialogue",
      "voice": "Voice name"
    }}
  ]
}}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional screenwriter. "
                        "Return only valid JSON matching the requested structure."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_completion_tokens=2000,
        )

        
        content = response.choices[0].message.content

        if not content or not content.strip():
            raise HTTPException(
                status_code=502,
                detail="The AI returned an empty response. Please try again."
            )

        content = content.strip()

        # Remove Markdown code fences if the model includes them.
        if content.startswith("```"):
            content = content.split("\n", 1)[-1]
            if content.rstrip().endswith("```"):
                content = content.rstrip()[:-3].strip()

        try:
            script = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=502,
                detail="The AI returned incomplete or invalid JSON. Please try again."
            )

        validated_script = ScriptPlan(**script)


        return {
            "status": "success",
            "script": validated_script.model_dump(),
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The LLM returned invalid JSON. Please try again."
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Script generation failed: {str(exc)}"
        )



class DialogueLine(BaseModel):
    character: str
    text: str
    voice: str


class ScriptPlan(BaseModel):
    title: str
    genre: str
    language: str
    dialogue: list[DialogueLine]


class SceneAudioTrack(BaseModel):
    character: str
    voice: str
    text: str
    audio_file: str


class SceneManifest(BaseModel):
    scene_id: str
    title: str
    tracks: list[SceneAudioTrack]



@app.post("/api/audio/generate")
def generate_audio(request: AudioRequest):
    if not GNANI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GNANI_API_KEY is not configured.",
        )

    try:
        client = GnaniTTSClient(
            api_key=GNANI_API_KEY,
            base_url=GNANI_TTS_BASE_URL,
            timeout=60,
        )

        output_dir = Path("outputs")
        output_dir.mkdir(parents=True, exist_ok=True)

        # Use a unique filename for every request.
        import uuid
        output_path = output_dir / f"{uuid.uuid4().hex}.wav"

        audio = client.synthesize(
            request.text,
            voice=request.voice,
            model=GNANI_TTS_MODEL,
            language=request.language,
            speed=request.speed,
            audio_config=AudioConfig(
                encoding="linear_pcm",
                container="wav",
                num_channels=1,
                sample_rate=48000,
                sample_width=2,
            ),
            output_file=output_path,
        )

        return {
            "status": "success",
            "message": "Audio generated successfully.",
            "voice": request.voice,
            "file": str(output_path).replace("\\", "/"),
            "audio_bytes": len(audio),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Audio generation failed: {type(exc).__name__}: {exc}",
        ) from exc


@app.get("/api/audio/download")
def download_audio(file: str):
    audio_path = Path(file).resolve()
    output_dir = Path("outputs").resolve()

    if audio_path.parent != output_dir or not audio_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found.",
        )

    return FileResponse(
        path=audio_path,
        media_type="audio/wav",
        filename=audio_path.name,
    )


@app.get("/api/script/sample", response_model=ScriptPlan)
def sample_script():
    return {
        "title": "The Final Warning",
        "genre": "action",
        "language": "English",
        "dialogue": [
            {
                "character": "Narrator",
                "text": "The city fell silent as darkness approached.",
                "voice": "Kaveri"
            },
            {
                "character": "Hero",
                "text": "This ends tonight. I will protect this city.",
                "voice": "Pranav"
            },
            {
                "character": "Villain",
                "text": "You cannot stop what I have started.",
                "voice": "Girish"
            }
        ]
    }


@app.post("/api/audio/generate-character")
def generate_character_audio(request: DialogueAudioRequest):
    audio_request = AudioRequest(
        text=request.text,
        voice=request.voice,
        language=request.language,
        speed=request.speed,
    )

    result = generate_audio(audio_request)

    return {
        "character": request.character,
        "voice": request.voice,
        "audio": result,
    }


def generate_audio_to_path(
    request: AudioRequest,
    output_path: Path,
) -> int:
    if not GNANI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GNANI_API_KEY is not configured.",
        )

    try:
        client = GnaniTTSClient(
            api_key=GNANI_API_KEY,
            base_url=GNANI_TTS_BASE_URL,
            timeout=60,
        )

        output_path.parent.mkdir(parents=True, exist_ok=True)

        audio = client.synthesize(
            request.text,
            voice=request.voice,
            model=GNANI_TTS_MODEL,
            language=request.language,
            speed=request.speed,
            audio_config=AudioConfig(
                encoding="linear_pcm",
                container="wav",
                num_channels=1,
                sample_rate=48000,
                sample_width=2,
            ),
            output_file=output_path,
        )

        return len(audio)

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Audio generation failed: "
                f"{type(exc).__name__}: {exc}"
            ),
        ) from exc


@app.post("/api/audio/generate-batch")
def generate_batch_audio(request: BatchAudioRequest):
    scene_id = f"scene_{uuid.uuid4().hex[:8]}"
    scene_dir = Path("outputs") / scene_id
    scene_dir.mkdir(parents=True, exist_ok=True)

    results = []
    tracks = []

    for index, line in enumerate(request.dialogue, start=1):
        filename = f"track_{index:02d}.wav"
        output_path = scene_dir / filename

        try:
            audio_request = AudioRequest(
                text=line.text,
                voice=line.voice,
                language=line.language,
                speed=line.speed,
            )

            audio_bytes = generate_audio_to_path(
                audio_request,
                output_path,
            )

            tracks.append(
                SceneAudioTrack(
                    character=line.character,
                    voice=line.voice,
                    text=line.text,
                    audio_file=filename,
                )
            )

            results.append({
                "character": line.character,
                "voice": line.voice,
                "status": "success",
                "audio_file": str(output_path).replace("\\", "/"),
                "audio_bytes": audio_bytes,
            })

        except HTTPException as exc:
            results.append({
                "character": line.character,
                "voice": line.voice,
                "status": "failed",
                "error": exc.detail,
            })

    manifest = SceneManifest(
        scene_id=scene_id,
        title="Generated Scene",
        tracks=tracks,
    )

    manifest_path = scene_dir / "manifest.json"
    manifest_path.write_text(
        manifest.model_dump_json(indent=2),
        encoding="utf-8",
    )

    successful = sum(
        1 for item in results
        if item["status"] == "success"
    )

    return {
        "status": "completed",
        "scene_id": scene_id,
        "total_lines": len(request.dialogue),
        "successful_lines": successful,
        "failed_lines": len(results) - successful,
        "scene_folder": str(scene_dir).replace("\\", "/"),
        "manifest_file": str(manifest_path).replace("\\", "/"),
        "results": results,
    }



@app.post("/api/scene/manifest", response_model=SceneManifest)
def create_scene_manifest(request: BatchAudioRequest):
    scene_id = f"scene_{uuid.uuid4().hex[:8]}"
    scene_dir = Path("outputs") / scene_id
    scene_dir.mkdir(parents=True, exist_ok=True)

    tracks = []

    for index, line in enumerate(request.dialogue, start=1):
        tracks.append(
            SceneAudioTrack(
                character=line.character,
                voice=line.voice,
                text=line.text,
                audio_file=f"track_{index:02d}.wav",
            )
        )

    manifest = SceneManifest(
        scene_id=scene_id,
        title="Generated Scene",
        tracks=tracks,
    )

    manifest_path = scene_dir / "manifest.json"
    manifest_path.write_text(
        manifest.model_dump_json(indent=2),
        encoding="utf-8",
    )

    return manifest



@app.get("/api/scene/{scene_id}/download")
def download_scene(scene_id: str):
    if not scene_id.startswith("scene_"):
        raise HTTPException(
            status_code=400,
            detail="Invalid scene ID.",
        )

    output_root = Path("outputs").resolve()
    scene_dir = (output_root / scene_id).resolve()

    if scene_dir.parent != output_root or not scene_dir.is_dir():
        raise HTTPException(
            status_code=404,
            detail="Scene not found.",
        )

    manifest_path = scene_dir / "manifest.json"

    if not manifest_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Scene manifest not found.",
        )

    zip_buffer = BytesIO()

    with zipfile.ZipFile(
        zip_buffer,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
    ) as archive:
        for file_path in scene_dir.iterdir():
            if file_path.is_file() and (
                file_path.suffix.lower() == ".wav"
                or file_path.name == "manifest.json"
            ):
                archive.write(
                    file_path,
                    arcname=file_path.name,
                )

    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{scene_id}.zip"'
            )
        },
    )

@app.post("/api/scene/generate")
def generate_complete_scene(request: ScriptRequest):
    # Step 1: Generate the story using Groq.
    script_result = plan_script(request)

    script_data = script_result["script"]
    dialogue_lines = script_data["dialogue"]

    # Step 2: Convert dialogue into the format required by batch TTS.
    audio_request = BatchAudioRequest(
        dialogue=[
            DialogueAudioRequest(
                character=line["character"],
                text=line["text"],
                voice=request.voice_selections.get(
    list(dict.fromkeys(item["character"] for item in dialogue_lines)).index(line["character"]) + 1,
    line["voice"],
),
                language="en-IN" if request.language == "English" else request.language,
                speed=1.0,
            )
            for line in dialogue_lines
        ]
    )

    # Step 3: Generate audio tracks and the scene manifest.
    audio_result = generate_batch_audio(audio_request)

    return {
        "status": "success",
        "script": script_data,
        "audio": audio_result,
        "download_endpoint": (
            f"/api/scene/{audio_result['scene_id']}/download"
        ),
    }


@app.get("/api/scene/{scene_id}/track/{track_number}")
def play_scene_track(scene_id: str, track_number: int):
    scene_dir = Path("outputs") / scene_id

    if not scene_dir.exists() or not scene_dir.is_dir():
        raise HTTPException(status_code=404, detail="Scene not found")

    if track_number < 1 or track_number > 30:
        raise HTTPException(status_code=404, detail="Track not found")

    audio_file = scene_dir / f"track_{track_number:02d}.wav"

    if not audio_file.is_file():
        raise HTTPException(status_code=404, detail="Audio track not found")

    return FileResponse(
        path=audio_file,
        media_type="audio/wav",
        filename=audio_file.name,
    )
