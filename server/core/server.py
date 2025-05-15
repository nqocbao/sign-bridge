from tensorflow.keras.models import load_model
import numpy as np
import cv2
import os
import time
import mediapipe as mp

from mp_keypoints import mediapipe_detection, draw_styled_landmarks, extract_keypoints

mp_holistic = mp.solutions.holistic 
mp_drawing = mp.solutions.drawing_utils

# actions = []
# with open("data/words.txt", "r") as file:
#     actions = [line.strip() for line in file if line.strip()]

# actions = np.array(actions)
import os 
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

#from frame_extractor import actions, X_test, y_test, X_train, y_train

sequences_path = "data/sequences.npy"
labels_path = "data/labels.npy"
actions_path = "data/actions.npy"

# Check if saved data exists and load it
if os.path.exists(sequences_path) and os.path.exists(labels_path) and os.path.exists(actions_path):
    sequences = np.load(sequences_path)
    actions = np.load(actions_path)
    labels = np.load(labels_path).tolist()

X = sequences
# # X.shape
# print(X.shape)
y = to_categorical(labels).astype(int)
model = load_model('model1.h5')
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.save('modelfixed.keras')
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5)
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)

# In ra phần trăm độ chính xác
print(f"Accuracy: {accuracy * 100:.2f}%")
print(f"Loss: {loss:.4f}")
sequence = []
sentence = []
threshold = 0.8

# colors = [(245,117,16), (117,245,16), (16,117,245)]
# def prob_viz(res, actions, input_frame, colors):
#     output_frame = input_frame.copy()
#     for num, prob in enumerate(res):
#         cv2.rectangle(output_frame, (0,60+num*40), (int(prob*100), 90+num*40), colors[num], -1)
#         cv2.putText(output_frame, actions[num], (0, 85+num*40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
        
#     return output_frame

cap = cv2.VideoCapture(0)
# Set mediapipe model 
with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    while cap.isOpened():
        ret, frame = cap.read()
        image, results = mediapipe_detection(frame, holistic)
        draw_styled_landmarks(image, results)
        keypoints = extract_keypoints(results)

        sequence.append(keypoints)
        sequence = sequence[-50:]
        # if len(sequence) == 50:
        # # Use the model to make a prediction
		# 	prediction = model.predict([sequence])  # Input the sequence to the model
		# 	sign_class = np.argmax(prediction)
		
        # every 3 seconds, print preds to the terminal, get time from browser
        
        if len(sequence) % 50 == 0:
            res = model.predict(np.expand_dims(sequence, axis=0))[0]
            print(actions[np.argmax(res)])

            if res[np.argmax(res)] > threshold: 
                if len(sentence) > 0: 
                    if actions[np.argmax(res)] != sentence[-1]:
                        sentence.append(actions[np.argmax(res)])
                else:
                    sentence.append(actions[np.argmax(res)])

            if len(sentence) > 5: 
                sentence = sentence[-5:]

            #image = prob_viz(res, actions, image, colors)
            
        cv2.rectangle(image, (0,0), (640, 40), (245, 117, 16), -1)
        cv2.putText(image, ' '.join(sentence), (3,50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        
        cv2.imshow('OpenCV Feed', image)
		# if len(sentence) > curr_len and time.time() - start_time > 3 and len(preds) > 1:
        #         text = ' '.join(preds)
        #         print(preds)
        #         print(completion(text))
        #         start_time = time.time()
        #         curr_len = len(preds)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()