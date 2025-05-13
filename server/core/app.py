from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import tensorflow as tf
import numpy as np
import os
import cv2
import mediapipe as mp
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
from googletrans import LANGUAGES, Translator

from mp_keypoints import mediapipe_detection, draw_styled_landmarks, extract_keypoints

mp_holistic = mp.solutions.holistic 

app = Flask(__name__)

# CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

model = tf.keras.models.load_model('../test.h5')
actions = []
current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "data", "words.txt")

with open(file_path, "r", encoding="utf-8") as file:
    actions = [line.strip() for line in file if line.strip()]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    sequence = np.array(data['seq'])
    res = model.predict(np.expand_dims(sequence, axis=0))[0]
    print(actions[np.argmax(res)])
    return jsonify({"word": actions[np.argmax(res)]})

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)