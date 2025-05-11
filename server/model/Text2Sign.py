import requests
import numpy as np
import nltk
import string
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
import os
import json
from pose_format import Pose
from pose_format.pose_visualizer import PoseVisualizer
from pose_format.utils.generic import reduce_holistic
from pose_format.utils.holistic import load_holistic
from nltk.corpus import wordnet
import cv2
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# Tải dữ liệu cần thiết từ NLTK
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Định nghĩa stop words
stop_words = set(["mightn't", 're', 'wasn', 'wouldn', 'be', 'has', 'that', 'does', 'shouldn', 'do', "you've", 'off', 
                  'for', "didn't", 'm', 'ain', 'haven', "weren't", 'are', "she's", "wasn't", 'its', "haven't", 
                  "wouldn't", 'don', 'weren', 's', "you'd", "don't", 'doesn', "hadn't", 'is', 'was', "that'll", 
                  "should've", 'a', 'then', 'the', 'mustn', 'nor', 'as', "it's", "needn't", 'd', 'am', 'have', 
                  'hasn', 'o', "aren't", "you'll", "couldn't", "you're", "mustn't", 'didn', "doesn't", 'll', 'an', 
                  'hadn', 'whom', 'y', "hasn't", 'itself', 'couldn', 'needn', "shan't", 'isn', 'been', 'such', 
                  'shan', "shouldn't", 'aren', 'being', 'were', 'did', 'ma', 't', 'having', 'mightn', 've', 
                  "isn't", "won't", "is", "am", "are"])

# Từ điển thay thế các từ viết tắt và cụm từ
contraction_map = {
    "i'm": "i",
    "you're": "you",
    "he's": "he",
    "she's": "she",
    "it's": "it",
    "we're": "we",
    "they're": "they",
    "i've": "i",
    "you've": "you",
    "we've": "we",
    "they've": "they",
    "can't": "can not",
    "cannot": "can not",
    "won't": "will not",
    "will not": "will not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not"
}

# Tạo WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

# Hàm lấy loại từ POS cho từng từ
def get_wordnet_pos(word):
    """Map POS tag to the first character used by WordNetLemmatizer"""
    from nltk import pos_tag
    tag = pos_tag([word])[0][1][0].upper()
    tag_dict = {
        'J': wordnet.ADJ,  # Adjective
        'N': wordnet.NOUN,  # Noun
        'V': wordnet.VERB,  # Verb
        'R': wordnet.ADV   # Adverb
    }
    return tag_dict.get(tag, wordnet.NOUN)  # Default to noun if unknown

# Hàm chuẩn hóa câu
def normalize_sentence(sentence):
    # Chuyển chữ thường
    sentence = sentence.lower()
    # Thay thế các từ rút gọn
    for contraction, full_form in contraction_map.items():
        sentence = sentence.replace(contraction, full_form)
    # Loại bỏ dấu câu
    sentence = sentence.translate(str.maketrans("", "", string.punctuation))
    # Tách từ
    words = word_tokenize(sentence)
    # Loại bỏ stop words và lemmatize với POS tag
    filtered_words = [
        lemmatizer.lemmatize(word, get_wordnet_pos(word)) for word in words if word not in stop_words
    ]
    return " ".join(filtered_words)

# Các hàm xử lý video
def load_video_frames(cap: cv2.VideoCapture):
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    cap.release()
    return frames

def concatenate_videos(video_paths):
    all_frames = []
    fps = width = height = None
    for video_path in video_paths:
        if not is_video_duration_valid(video_path):
            continue
        cap = cv2.VideoCapture(video_path)
        if not fps:
            fps = int(cap.get(cv2.CAP_PROP_FPS))
        if not width:
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        if not height:
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        frames = load_video_frames(cap)
        all_frames.extend(frames)
    return all_frames, fps, width, height

def pose_video(frames, fps, width, height, output_path):
    pose = load_holistic(frames, fps=fps, width=width, height=height, progress=True, additional_holistic_config={'model_complexity': 1})
    pose = reduce_holistic(pose)
    with open(output_path, "wb") as f:
        pose.write(f)

def visualize(pose_file: str, gif_file: str):
    with open(pose_file, "rb") as f:
        pose = Pose.read(f.read())
    vis = PoseVisualizer(pose, thickness=1)
    vis.save_gif(gif_file, vis.draw())

def check_video_url(url):
    try:
        response = requests.head(url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

def is_video_duration_valid(video_path, max_duration=60):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return False
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    duration = frame_count / fps if fps > 0 else 0
    cap.release()
    return duration <= max_duration

# Đọc dữ liệu WLASL
with open("C:/Users/Thu Trang/Downloads/Sign-language-translator/server/data/WLASL_v0.3.json") as f:
    wlasl = json.load(f)

glosses = {gloss["gloss"].lower(): i for i, gloss in enumerate(wlasl)}

# Đường dẫn
pose_directory = "poses"
gif_file = "C:/Users/Thu Trang/Downloads/Sign-language-translator/server/demo.gif"
if not os.path.exists(pose_directory):
    os.mkdir(pose_directory)

# Flask API
app = Flask(__name__)
CORS(app)

@app.route('/generate-gif', methods=['POST'])
def generate_gif():
    data = request.json
    sentence = data.get('sentence', '').strip()
    
    if not sentence:
        return jsonify({'error': 'Sentence is required'}), 400

    try:
        normalized_sentence = normalize_sentence(sentence)
        print(f"Normalized Sentence: {normalized_sentence}")
        words = normalized_sentence.split()
        video_paths = []

        for word in words:
            try:
                idx = glosses[word]
                gloss = wlasl[idx]
            except KeyError:
                continue

            for instance in gloss["instances"]:
                video_url = instance.get("url")
                if video_url and check_video_url(video_url) and is_video_duration_valid(video_url):
                    video_paths.append(video_url)
                    break

        if not video_paths:
            return jsonify({'error': 'No valid videos found for the given sentence'}), 400

        frames, fps, width, height = concatenate_videos(video_paths)
        pose_output_path = f'{pose_directory}/sentence.pose'
        pose_video(frames, fps, width, height, pose_output_path)
        visualize(pose_output_path, gif_file)
        print("Generating GIF...")

        return send_file(gif_file, mimetype='image/gif')
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
