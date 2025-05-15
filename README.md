Sign Language Learning and Translation App
Giới thiệu
Dự án Sign Language Learning and Translation App là một ứng dụng hỗ trợ học và dịch ngôn ngữ ký hiệu, giúp người dùng học các cử chỉ ký hiệu và dịch ngôn ngữ ký hiệu sang văn bản hoặc ngược lại. Ứng dụng được xây dựng với mục tiêu cung cấp một nền tảng dễ sử dụng, trực quan và hiệu quả để hỗ trợ cộng đồng người khiếm thính và những người muốn học ngôn ngữ ký hiệu.

Frontend: Sử dụng ReactJS để xây dựng giao diện người dùng động và thân thiện.
Backend: Sử dụng Flask (Python) để xử lý logic phía server, API và tích hợp các mô hình dịch ngôn ngữ ký hiệu.

Tính năng chính

Học ngôn ngữ ký hiệu: Cung cấp các bài học tương tác với video và hướng dẫn chi tiết về các cử chỉ ký hiệu.
Dịch ngôn ngữ ký hiệu: Dịch từ ký hiệu sang văn bản hoặc từ văn bản sang ký hiệu bằng cách sử dụng webcam và mô hình AI.
Giao diện thân thiện: Giao diện hiện đại, dễ sử dụng, hỗ trợ đa nền tảng (web).
Quản lý người dùng: Đăng ký, đăng nhập và lưu tiến độ học tập của người dùng.
API mạnh mẽ: Backend cung cấp các endpoint để xử lý yêu cầu từ frontend, tích hợp mô hình học máy.

Công nghệ sử dụng
Frontend

ReactJS: Thư viện JavaScript để xây dựng giao diện người dùng.
Tailwind CSS: Framework CSS để thiết kế giao diện responsive.
React Router: Quản lý định tuyến trong ứng dụng.

Backend

Flask: Framework Python nhẹ để xây dựng API.
Flask-RESTful: Xây dựng API RESTful.
OpenCV/TensorFlow (tùy chọn): Xử lý video và tích hợp mô hình học máy để nhận diện ký hiệu.

Cài đặt và chạy dự án
Yêu cầu

Node.js (v16 hoặc cao hơn)
Python (v3.10 hoặc v3.11)
Git

Cài đặt
1. Clone repository
git clone https://github.com/nqocbao/sign-bridge
cd sign-bridge

2. Cài đặt Frontend
cd frontend
npm install

3. Cài đặt Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt


4. Chạy ứng dụng

Backend:
cd backend
flask run


Frontend:
cd frontend
npm start


Mở trình duyệt và truy cập http://localhost:3000 để sử dụng ứng dụng.