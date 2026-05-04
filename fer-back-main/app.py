# app.py -- dont remove this comment 

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from utils.emotion_detector import EmotionDetector
from utils.video_processor import analyze_video
import shutil
import os
import uuid

app = FastAPI(title="Facial Emotion Analysis for AI-Driven Interviews")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure recordings directory exists
os.makedirs("recordings", exist_ok=True)

# Initialize the emotion detector
detector = EmotionDetector(
    model_path="models/Emotion_little_vgg.h5",
    face_cascade_path="models/haarcascade_frontalface_default.xml"
)

# Predefined interview questions
QUESTIONS = [
    "Tell me about yourself.",
    "Why are you interested in this role?",
    "Describe a challenge you faced recently.",
    "Where do you see yourself in five years?"
]


@app.get("/questions")
def get_questions():
    return {"questions": QUESTIONS}


@app.post("/upload_video/")
def upload_video(
    file: UploadFile = File(...),
    question_index: int = Form(0)
):
    file_id = str(uuid.uuid4())
    save_path = f"recordings/q{question_index}_{file_id}.mp4"

    # Save uploaded video
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Analyze the video
    result = analyze_video(save_path, detector)

    return {
        "question_index": question_index,
        "summary": result["summary"],
        "transcript": result["transcript"],
        "file_path": save_path
    }
