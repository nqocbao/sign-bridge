# Sign Language Learning and Translation App

[![ReactJS](https://img.shields.io/badge/ReactJS-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Shadcn](https://img.shields.io/badge/Shadcn-000000.svg?style=for-the-badge&logo=shadcn&logoColor=white)](https://ui.shadcn.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245.svg?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Flask](https://img.shields.io/badge/Flask-000000.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8.svg?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00.svg?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)

---

## Giới thiệu

**Sign Language Learning and Translation App** 🤟 là một ứng dụng hỗ trợ **học** và **dịch ngôn ngữ ký hiệu**, giúp người dùng nắm bắt các cử chỉ ký hiệu và chuyển đổi giữa ngôn ngữ ký hiệu và văn bản. Ứng dụng được thiết kế với mục tiêu mang đến một nền tảng **trực quan**, **dễ sử dụng** và **hiệu quả**, hỗ trợ cộng đồng người khiếm thính cũng như những ai muốn học ngôn ngữ ký hiệu.

---

## Môi Trường Phát Triển

### 1. **Frontend**

- **URL**: `http://localhost:3000`
- **Công Nghệ Sử Dụng**:
  - ReactJS
  - TypeScript
  - Shadcn
  - TailwindCSS
  - React Router

### 2. **Backend**

- **URL**: `http://localhost:5000`
- **Công Nghệ Sử Dụng**:
  - Flask
  - Flask-RESTful
  - OpenCV / TensorFlow (tùy chọn)

---

## Hướng dẫn cài đặt 🛠️

### Yêu cầu hệ thống 💻
- **Node.js:** Phiên bản 16 hoặc cao hơn.
- **Python:** Phiên bản 3.10 hoặc 3.11.
- **Git:** Để clone repository.

### Các bước cài đặt 🔧

1. **Clone repository** 📥:
   ```bash
   git clone https://github.com/nqocbao/sign-bridge.git
   cd sign-bridge
   ```

2. **Cài đặt dependencies cho Frontend** ⚛️:
   ```bash
   cd frontend
   npm install
   ```

3. **Cài đặt dependencies cho Backend** 🔌:
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   pip install -r requirements.txt
   ```

4. **Chạy ứng dụng Backend** ⚙️:
   ```bash
   flask run
   ```

5. **Chạy ứng dụng Frontend** 🚀:
   ```bash
   cd ../frontend
   npm start
   ```

6. **Truy cập ứng dụng** 🌐: Mở trình duyệt và truy cập `http://localhost:3000`.

---

## :twisted_rightwards_arrows: Cách làm việc nhóm 

### 1. **Chiến Lược Branching**

Để tránh xung đột mã nguồn, các thành viên nên tuân thủ chiến lược **branching**:

- **Nhánh Chính (`main`)**: Luôn chứa mã nguồn ổn định và sẵn sàng cho sản xuất. Không commit trực tiếp vào nhánh này.
- **Nhánh Phát Triển (`dev`)**: Dùng để phát triển, các tính năng sẽ được merge vào sau khi review. Không commit trực tiếp vào nhánh này.
- **Nhánh Tính Năng**: Mỗi thành viên tạo một nhánh riêng khi làm việc trên một task cụ thể. Ví dụ:
  - `feature/user-auth`
  - `feature/sign-detection`

#### Các bước tạo và làm việc trên nhánh tính năng:

1. Lấy các thay đổi mới nhất từ nhánh `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. Tạo một nhánh tính năng mới:
   ```bash
   git checkout -b feature/my-feature
   ```

3. Sau khi hoàn thành, commit và đẩy thay đổi lên:
   ```bash
   git add .
   git commit -m "feat: implement feature X"
   git push origin feature/my-feature
   ```

4. Tạo pull request trên GitHub để review và merge.

### 2. **Quy Tắc Đặt Tên Commit**

Sử dụng các thông báo commit rõ ràng và nhất quán:

- **feat:** cho tính năng mới
- **fix:** cho sửa lỗi
- **refactor:** cho cấu trúc lại mã
- **chore:** cho công việc liên quan đến build tools hoặc dependencies
- **docs:** cho các thay đổi về tài liệu

Ví dụ:
```bash
feat: Thêm chức năng dịch ký hiệu sang văn bản
fix: Sửa lỗi không hiển thị video hướng dẫn
```

### 3. **Quy Trình Code Review**

- Mỗi pull request cần được review trước khi merge vào `main` hoặc `dev`.
- Sử dụng **GitHub Issues** hoặc bình luận trên pull request để thảo luận.

---

## Hướng dẫn sử dụng

Sau khi cài đặt, người dùng có thể:
- Mở ứng dụng và bắt đầu học ngôn ngữ ký hiệu qua các bài học tương tác 📚.
- Sử dụng webcam để dịch ký hiệu sang văn bản hoặc ngược lại 🔄.
- Đăng ký/đăng nhập để lưu tiến độ học tập 👤.
- Tận hưởng giao diện thân thiện, hỗ trợ đa nền tảng 🖥️.

---

## Tài Liệu API

- Backend cung cấp các API để xử lý yêu cầu từ frontend và tích hợp mô hình học máy.
- Sử dụng **Postman** hoặc **Insomnia** để kiểm tra API.
- Tài liệu API sẽ được bổ sung trong thư mục `backend/docs` khi dự án tiến triển.

---

## :computer: Cách chạy thử Ứng Dụng

- Sau khi chạy frontend và backend, truy cập `http://localhost:3000` để trải nghiệm ứng dụng.
- Đảm bảo webcam hoạt động để sử dụng tính năng dịch ký hiệu.

Nếu có bất kỳ thắc mắc hoặc góp ý nào, vui lòng liên hệ qua GitHub hoặc email.

---

**Sign Language Learning and Translation App** hướng tới mục tiêu tạo ra một công cụ hỗ trợ học tập và giao tiếp hiệu quả, giúp cộng đồng người khiếm thính kết nối dễ dàng hơn. Hãy cùng nhau đóng góp và phát triển dự án để xây dựng một môi trường số thân thiện và tiện lợi cho tất cả mọi người!
