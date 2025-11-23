# Natural Disaster Response – Frontend

MVP frontend cho hệ thống hướng dẫn & cảnh báo thiên tai, dùng React + Vite + TypeScript + Tailwind + Zustand.

## Chạy dự án

```bash
npm install
npm run dev
```

Biến môi trường cần thiết:

- `VITE_API_BASE` – base URL của backend (ví dụ: `http://localhost:4000/api`).
- `VITE_ADDRESSKIT_BASE` – base URL AddressKit (mặc định `https://addresskit.cas.so`).
- `VITE_ADDRESSKIT_EFFECTIVE_DATE` – ngày hiệu lực cho AddressKit (mặc định `latest`).

## Kiến trúc chính

- `src/lib/api.ts`: API client (fetch) với các endpoint provinces/guides/shelters/contacts/alerts + auth.
- `src/store`: Zustand stores cho auth, province, disaster data (cache guide, shelters, contacts, alert mới nhất).
- `src/hooks/useChecklistState.ts`: Lưu trạng thái checklist theo `checklist:${provinceSlug}:${disasterCode}` trên localStorage.
- `src/components/province/MapPreview.tsx`: mini map nơi trú ẩn dùng OpenStreetMap embed (không cần API key).
- `src/lib/addressKit.ts`: client gọi AddressKit (provinces) dùng làm nguồn chính; nếu lỗi mới fallback backend/mẫu.
- `src/pages`: Trang Public (Home, Province, Alert detail) và Admin (login, dashboard, content, shelters, contacts, alerts, provinces list/config, disasters, users mock).
- `src/components`: Navbar, hero, các section hiển thị checklist, tips, shelter, emergency, alert banner; form CRUD đơn giản cho admin.

## Lưu ý

- UI sử dụng Tailwind và các component đơn giản (button/input/card/badge/toast) tương tự shadcn.
- Checklist chỉ lưu localStorage, không đụng server; admin CRUD gọi API ở `lib/api.ts`.
- Không commit `.env` chứa key thật.
- Ứng dụng ưu tiên tải danh sách tỉnh từ AddressKit; chỉ khi lỗi mới thử backend, cuối cùng là dữ liệu mẫu.
