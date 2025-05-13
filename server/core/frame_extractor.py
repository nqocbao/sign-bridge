import numpy as np
import os
import cv2
import mediapipe as mp
import pdb
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from mp_keypoints import extract_keypoints, mediapipe_detection
from data_loader import download_video, load_json

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_holistic = mp.solutions.holistic

sequences, labels = [], []
no_sequence = 50

actions = []
    
with open("data/words.txt", "r") as file:
    actions = [line.strip() for line in file]
    # for line in file:
    #     # Split each line into parts and get the word part
    #     parts = line.strip().split()
    #     if len(parts) > 1:
    #         word = parts[1]  # This is the word after the index
    #         actions.append(word) 
label_map = {label:num for num, label in enumerate(actions)}
print(actions)
print(label_map)
print(label_map["book"])

def transform(path, gloss, instance):
    # data_path = "data/MP_data"
    # os.makedirs(data_path, exist_ok=True)
    frame_number = 0
    window = []
    cap = cv2.VideoCapture(path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print('frame count', frame_count)
    if frame_count == 0:
        cap.release()
        return False
    step = max(1, frame_count // no_sequence)
    with mp_holistic.Holistic(min_detection_confidence=0.5,min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            for frame_number in range(0, frame_count, step):
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
                ret, frame = cap.read()
                if not ret:
                    break

                image, results = mediapipe_detection(frame, holistic)
                keypoints = extract_keypoints(results)

                # id = instance['video_id']
                # npy_path = f'data/MP_data/{gloss}/{id}/{frame_number}.npy'
        
                # if os.path.exists(npy_path):
                #     #print(f"Keypoints for frame {frame_number} already exist. Loading existing data.")
                #     keypoints = np.load(npy_path)
                    
                # else:
                #     os.makedirs(os.path.dirname(npy_path), exist_ok=True)
                #     image, results = mediapipe_detection(frame, holistic)
                #     keypoints = extract_keypoints(results)
                    
                #     # Save the keypoints to the .npy file
                #     try:
                #         np.save(npy_path, keypoints)
                #     except Exception as e:
                #         print(f"Error saving keypoints: {e}")
                window.append(keypoints)
                if len(window) >= no_sequence or frame_count == 0:
                    break
            
            cap.release()
            cv2.destroyAllWindows()
    while len(window) < no_sequence:
        window.append(extract_keypoints(results))
    sequences.append(window)
    return True

def extract_frames(data, videos_folder):
    os.makedirs(videos_folder, exist_ok=True)
    for gloss in data:
        for instance in gloss['instances']:
            url = instance['url']
            video_id = instance['video_id']
            save_path = os.path.join(videos_folder, f"{video_id}.mp4")
            #print(f"Downloading {instance['video_id']}...")
            #download_video(url, save_path)
            if transform(save_path, gloss['gloss'], instance):
                labels.append(label_map[gloss['gloss']])

json_data_path = "data/test.json"
videos_folder = "data/videos/" 
data, video_data = load_json(json_data_path)
extract_frames(data, videos_folder)
try:
    sequences_array = np.array(sequences)
    print("Shape of sequences array:", sequences_array.shape)
except Exception as e:
    print(f"Error creating numpy array: {e}")
    
sequences_path = "data/sequences.npy"
np.save(sequences_path, np.array(sequences))

actions_path = "data/actions.npy"
np.save(actions_path, np.array(actions))

lables_path = "data/labels.npy"
np.save(lables_path, np.array(labels))


