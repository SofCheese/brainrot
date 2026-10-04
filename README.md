# Bản cập nhật: ảnh thực tế ở 8 slide + bỏ nhãn góc phải

BẢN NÀY KHÔNG CẦN THƯ MỤC ASSETS.
1. Giải nén ZIP vào một thư mục mới trên máy.
2. Trong repository GitHub cũ, tại trang có index.html, chọn Add file > Upload files.
3. Chọn TẤT CẢ file vừa giải nén và upload cùng lúc, rồi Commit changes. Các file code trùng tên sẽ được cập nhật.
4. Giữ tên ảnh nguyên vẹn. Tất cả ảnh, font và code nằm cùng cấp với index.html. Thư mục assets cũ trên GitHub có thể giữ nguyên, bản mới không dùng nó.
5. Chờ GitHub Pages triển khai xong, mở lại trang và Ctrl + F5.

## Sửa nội dung
- slides.json: tiêu đề, nội dung HTML, nguồn và lời thuyết trình của 24 slide.
- index.html: trang Search, quote, menu và wrap-up.
- app.js: điều hướng, tìm kiếm, orbit và các tương tác.
- style.css + immersive.css: bố cục, màu, hiệu ứng glass và thiết kế responsive.
- fonts.css + font-*.ttf: font cục bộ.
- Các file .png/.jpg ở thư mục gốc: toàn bộ hình ảnh.
- IMAGE_CREDITS.md: nguồn ảnh.
- speaker-notes.txt: bản lời thuyết trình tải xuống; cập nhật cùng slides.json nếu sửa lời nói.

## Xem thử trên máy
Không mở index.html trực tiếp bằng file:// vì website cần fetch slides.json.
Nếu máy có Python, mở terminal trong thư mục chứa index.html và chạy:

    python -m http.server 8000

Sau đó truy cập http://localhost:8000. Hoặc dùng extension Live Server trong VS Code.

## Điều khiển
- Search: hiện BRAINROT rồi chuyển sang quote.
- ↶ Start hoặc phím Home: về đúng màn hình Search đầu tiên.
- BR: mở menu chương.
- 1–4: chuyển chương. ← →: chuyển slide.
- G: danh sách slide. N: speaker notes. F: bật/tắt fullscreen.
- Kéo các nhân vật ở wrap-up để xoay, click để xem kết quả.

Sau khi chỉnh sửa, upload các file thay đổi và commit vào main để GitHub Pages cập nhật.
