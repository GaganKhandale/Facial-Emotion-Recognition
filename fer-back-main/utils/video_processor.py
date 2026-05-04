# utils/video_processor.py -- updated
import cv2
import whisper
import tempfile
import os
from .emotion_detector import EmotionDetector

whisper_model = whisper.load_model("base")

def transcribe_audio_from_video(video_path: str) -> str:
    """Extract audio from video and transcribe using Whisper."""
    import subprocess
    import tempfile

    try:
        # Step 1: Extract audio to temp file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            audio_path = temp_audio.name

        command = [
            "ffmpeg",
            "-y",  # overwrite if exists
            "-i", video_path,
            "-vn",  # no video
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            audio_path
        ]
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        # Step 2: Transcribe extracted audio
        result = whisper_model.transcribe(audio_path)
        os.remove(audio_path)
        return result["text"].strip() if result["text"].strip() else "(no speech detected)"

    except subprocess.CalledProcessError as e:
        print(f"[FFmpeg error] {e}")
        return "(audio extraction failed)"
    except Exception as e:
        print(f"[Transcription error] {e}")
        return "(transcription failed)"


def analyze_video(video_path, detector: EmotionDetector):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    preds = detector.predict_emotions(frames)
    summary = detector.summarize_emotions(preds)
    transcript = transcribe_audio_from_video(video_path)
    return {"summary": summary, "transcript": transcript}
