# utils/emotion_detector.py -- dont remove this comment

import cv2, numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

class EmotionDetector:
    def __init__(self, model_path, face_cascade_path):
        self.class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprise']
        self.face_classifier = cv2.CascadeClassifier(face_cascade_path)
        self.model = load_model(model_path)

    def predict_emotions(self, frames):
        preds = []
        for frame in frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_classifier.detectMultiScale(gray, 1.3, 5)
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y + h, x:x + w]
                roi_gray = cv2.resize(roi_gray, (48, 48))
                roi = roi_gray.astype("float") / 255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)
                pred = self.model.predict(roi, verbose=0)[0]
                preds.append(pred)
        return preds

    def summarize_emotions(self, preds):
        if not preds:
            return {emo: 0 for emo in self.class_labels}
        preds = np.array(preds)
        mean_pred = preds.mean(axis=0)
        return {emo: round(float(p) * 100, 2) for emo, p in zip(self.class_labels, mean_pred)}
