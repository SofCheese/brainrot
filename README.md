# Brainrot · TAHT Research Presentation

Toàn bộ mã nguồn website tĩnh, gồm HTML, CSS, JavaScript, 24 slide, speaker notes, font và ảnh. Không cần npm hay bước build.

## Đưa lên GitHub Pages
1. Giải nén ZIP này.
2. Tạo repository Public trên GitHub, ví dụ brainrot-presentation.
3. Chọn Add file > Upload files. Upload toàn bộ NỘI DUNG thư mục vừa giải nén, giữ nguyên thư mục assets. index.html phải nằm ngay ở thư mục gốc repository, không nằm trong một thư mục lồng thêm. Không upload riêng file ZIP.
4. Commit changes. Vào Settings > Pages > Build and deployment: Source = Deploy from a branch; Branch = main; Folder = /(root); Save.
5. Chờ GitHub triển khai, rồi mở URL hiển thị trong Settings > Pages. URL thường có dạng https://USERNAME.github.io/brainrot-presentation/.

Giữ file .nojekyll nếu công cụ upload của bạn hiển thị file này; nó cho GitHub biết đây là website tĩnh thuần. Website dùng đường dẫn tương đối nên hoạt động trong repository Pages.

## Sửa nội dung
- slides.json: tiêu đề, nội dung HTML, nguồn và lời thuyết trình của 24 slide.
- index.html: trang Search, quote, menu và wrap-up.
- app.js: điều hướng, tìm kiếm, orbit và các tương tác.
- style.css + immersive.css: bố cục, màu, hiệu ứng glass và thiết kế responsive.
- fonts.css + font-*.ttf: font cục bộ.
- assets/: toàn bộ hình ảnh.
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
