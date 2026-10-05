# TAHT Brainrot

## Cập nhật GitHub
1. Giải nén ZIP vào một thư mục mới.
2. Vào repository cũ, trang có index.html > Add file > Upload files.
3. Upload TOÀN BỘ file vừa giải nén cùng lúc. Commit changes.
4. Chờ GitHub Pages cập nhật xong, mở URL trang chủ không có # ở cuối và nhấn Ctrl + F5.

Tất cả ảnh, font và code nằm cùng cấp. Không cần thư mục assets. Thư mục assets cũ có thể giữ nguyên.
Cần cập nhật cả index.html, app.js, slides.json và immersive.css cùng nhau vì cấu trúc chương đã đổi.

## Mạch trình chiếu
Hook đồng hồ → Quote → Search Brainrot / Word of the Year 2024 → Tên đề tài → Menu 4 chương.

- Hook: bấm Let time slip, đồng hồ chạy 23:00 → 02:00. Bấm Continue khi đã nói xong.
- Quote: bấm Discover the word.
- Search: gõ brainrot và Enter hoặc Search. Kết quả ở lại để thuyết trình; bấm Continue để sang tên đề tài.
- Tên đề tài: bấm Explore the research để chọn chương.
- Phenomenon: ba ô Content / Interface & Experience / Platforms & Algorithms. Bấm trong vùng slide hoặc bấm Click to connect the dots để hiện Attention economy → User retention → Hard to stop. Phím mũi tên phải lần đầu cũng hiện dòng này, lần tiếp theo chuyển sang Pain Point.
- Start hoặc Home: quay lại hook đồng hồ đầu tiên.
- BR: menu chương; 1–4: chuyển chương.
- ← →: chuyển bước/slide; G: danh sách slide; N: ghi chú; F: toàn màn hình.

20 mục trong danh sách slide, tính cả wrap-up tương tác và references. Hook, quote, search và tên đề tài là các màn mở đầu riêng, không lặp trong Phenomenon.

## Sửa file
index.html: các màn mở đầu, menu và wrap-up.
app.js: điều hướng và hiệu ứng tương tác.
slides.json: nội dung/nguồn/ghi chú của các slide trong chương.
immersive.css và style.css: bố cục và màu.
speaker-notes.txt: lời thuyết trình, có phần hook và tên nhóm.
IMAGE_CREDITS.md: nguồn ảnh.

## Xem trên máy
Không mở index.html bằng file://. Trong thư mục giải nén, nếu đã cài Python:

    python -m http.server 8000

Mở http://localhost:8000. Hoặc dùng Live Server trong VS Code.
