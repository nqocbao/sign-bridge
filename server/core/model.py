from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import TensorBoard
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
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.05)
# y_test.shape

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

actions = np.array(actions)
log_dir = os.path.join('Logs')
tb_callback = TensorBoard(log_dir=log_dir)
model = Sequential()
model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=(50,1662)))
model.add(LSTM(128, return_sequences=True, activation='relu'))
model.add(LSTM(64, return_sequences=False, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(32, activation='relu'))
model.add(Dense(actions.shape[0], activation='softmax'))

model.compile(optimizer='Adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
from tensorflow.keras.callbacks import EarlyStopping

early_stopping = EarlyStopping(monitor='val_accuracy',
                               patience=10,
                                mode='max',
                               restore_best_weights=True)
model.fit(X_train, y_train, epochs=400, validation_data=(X_val, y_val), callbacks=[tb_callback, early_stopping])
model.summary()

# res = model.predict(X_test)
# print(actions[np.argmax(res[0])])

model.save('test.h5')

#model 1: 500 epochs, no early stopping
#model 2: validation, early stopping