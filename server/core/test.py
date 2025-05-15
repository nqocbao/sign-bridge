import cv2
import numpy as np
import os
import matplotlib.pyplot as plt
import time
import mediapipe as mp


# mp_holistic = mp.solutions.holistic 
# mp_drawing = mp.solutions.drawing_utils
# path = "data/videos/11111.mp4"
# cap = cv2.VideoCapture(path)
# frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
# if (frame_count == 0):
# 	print(0)

# ret, frame = cap.read()
# if not ret:
#     print("invalid")
    
actions = []
with open("data/words.txt", "r") as file:
    actions = [line.strip() for line in file if line.strip()]

actions = np.array(actions)
sequences_path = "data/actions.npy"
np.save(sequences_path, actions)