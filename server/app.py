from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload-video', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Lưu file video
        video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
        video_file.save(video_path)

        # TODO: Thêm xử lý video và nhận dạng ký hiệu ở đây
        # Tạm thời trả về kết quả mẫu
        prediction = "Sample sign language prediction"

        return jsonify({
            'success': True,
            'prediction': prediction
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ... existing code ... 