
import os
from pathlib import Path

from dotenv import load_dotenv
from gnani.tts.client import GnaniTTSClient, AudioConfig

load_dotenv()

api_key = os.getenv("GNANI_API_KEY")
if not api_key:
    raise RuntimeError("GNANI_API_KEY is missing from your .env file.")

client = GnaniTTSClient(
    api_key=api_key,
    base_url=os.getenv("GNANI_TTS_BASE_URL", "https://api.vachana.ai"),
    timeout=60,
)

output_path = Path("outputs") / "gnani_test.wav"

try:
    audio = client.synthesize(
        "Hello! Welcome to VoiceForge Studio.",
        voice="Girish",
        model="timbre-v2.5",
        language="en-IN",
        speed=1.0,
        audio_config=AudioConfig(
            encoding="linear_pcm",
            container="wav",
            num_channels=1,
            sample_rate=48000,
            sample_width=2,
        ),
        output_file=output_path,
    )

    print(f"Success! Audio saved to: {output_path}")
    print(f"Audio size: {len(audio):,} bytes")

except Exception as exc:
    print(f"TTS request failed: {type(exc).__name__}: {exc}")
    raise
