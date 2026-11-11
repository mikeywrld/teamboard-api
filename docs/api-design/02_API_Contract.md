# TeamBoard REST API contract

Đặc tả thiết kế. Hiện tại chỉ endpoint health đã có trong danh sách bên dưới.

| Method | Endpoint | Auth | Mô tả | Mã thành công |
| --- | --- | --- | --- | --- |
| POST | /api/v1/auth/register | Không | Đăng ký | 201 |
| POST | /api/v1/auth/login | Không | Đăng nhập, trả JWT | 200 |
| GET | /api/v1/auth/me | Có | Thông tin người dùng hiện tại | 200 |
| GET | /api/v1/projects | Có | Project của tôi | 200 |
| POST | /api/v1/projects | Có | Tạo project | 201 |
| POST | /api/v1/projects/join | Có | Tham gia bằng mã | 200 |
| GET | /api/v1/projects/:id | Có | Chi tiết project | 200 |
| DELETE | /api/v1/projects/:id | Chủ | Xóa project | 204 |
| GET | /api/v1/projects/:id/members | Có | Danh sách thành viên | 200 |
| GET | /api/v1/projects/:id/tasks | Có | Task, hỗ trợ ?status=&assignee=&q=&sort=&page=&per-page= | 200 |
| POST | /api/v1/projects/:id/tasks | Có | Tạo task | 201 |
| GET | /api/v1/tasks/:id | Có | Chi tiết task | 200 |
| PUT | /api/v1/tasks/:id | Có | Sửa task | 200 |
| PATCH | /api/v1/tasks/:id/status | Có | Chuyển cột (PATCH là bổ sung ngoài slide, dùng cho cập nhật một phần) | 200 |
| DELETE | /api/v1/tasks/:id | Có | Xóa task | 204 |
| GET | /api/v1/tasks/:id/comments | Có | Bình luận | 200 |
| POST | /api/v1/tasks/:id/comments | Có | Thêm bình luận | 201 |
| GET | /api/v1/projects/:id/activities | Có | Nhật ký hoạt động | 200 |
| GET | /api/v1/projects/:id/stats | Có | Thống kê đóng góp | 200 |
| GET | /api/v1/health | Không | Kiểm tra server | 200 |

## Quy ước

- API gốc /api/v1. Đăng nhập trả JWT, client gửi Authorization: Bearer <token>. Không trả password_hash. Owner mới được xóa project; các tài nguyên project chỉ dành cho thành viên.
- JSON dùng camelCase, lưu MySQL bằng snake_case. Ngày hạn theo YYYY-MM-DD; timestamps theo ISO 8601. DELETE thành công trả 204 không body.
- Lỗi trả { "error": { "code": "...", "message": "..." } }. Sai đầu vào 400, thiếu hoặc sai token 401, thiếu quyền 403, tài nguyên không tồn tại 404, xung đột 409, lỗi ngoài dự kiến 500.
- Đề xuất mặc định phân trang page=1, per-page=20, tối đa 100. Sort dùng một danh sách cho phép, ví dụ due-date, -due-date, -created-at. Lọc title/description theo q. Response danh sách task đề xuất dùng items, page, perPage và total.

## Payload và quy tắc

| Thao tác | Body | Kết quả điển hình |
| --- | --- | --- |
| Register | name, email, password | User công khai gồm id, name, email |
| Login | email, password | token và user |
| Create project | name, description tùy chọn | Project và joinCode của owner |
| Join project | joinCode | Project đã tham gia, nhập lại không sinh membership trùng |
| Create task | title, description, priority, dueDate, assigneeId | Task đã lưu, status mặc định todo |
| Update task | title, description, priority, dueDate, assigneeId | Task sau thay đổi; chuyển cột qua endpoint riêng |
| Move task | status | Task sau khi đổi trạng thái |
| Add comment | content | Comment có id, tác giả và thời gian |
| Activity / Stats | Không có body | Activity có actor, action và createdAt. Stats theo member có assignedTasks, completedTasks, commentCount |

Ví dụ tạo task: {"title":"Prepare demo","priority":"high","dueDate":"2026-11-27","assigneeId":2}. Ví dụ chuyển cột: {"status":"done"}. Trạng thái hợp lệ: todo, doing, review, done. Priority hợp lệ: low, medium, high. ProjectId, createdBy và dữ liệu audit lấy từ route/session, không nhận tùy ý từ client.

## Kịch bản nghiệm thu khi đã triển khai

1. Owner đăng nhập, tạo project, chia sẻ mã. Member dùng mã để tham gia.
2. Owner tạo task gán cho member, member mở Board và chuyển task sang Done.
3. Refresh hoặc khởi động lại API, đọc lại task và kiểm tra cùng ID/status. Nhật ký ghi người thao tác nếu tính năng F8 đã triển khai.
4. Tài khoản ngoài project gọi chi tiết task nhận 403; gửi title rỗng nhận 400; token sai nhận 401.
5. So sánh contract, Postman và response thật trước khi công bố tài liệu API.

Chi tiết mặc định và mẫu payload là đề xuất thiết kế tuần 2. Duyệt cùng nhóm trước khi coi là contract chính thức.
