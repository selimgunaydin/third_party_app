# Third Party App

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş full-stack bir uygulamadır.

## 🚀 Teknoloji Yığını

### Backend
- Node.js
- Express.js
- MongoDB (varsayılan)
- JWT Authentication

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ESLint

## 📁 Proje Yapısı

```
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── public/
│   └── server.js
│
└── frontend/
    ├── src/
    ├── public/
    └── certificates/
```

## 🛠 Kurulum

### Backend Kurulumu
1. Backend dizinine gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını yapılandırın:
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Sunucuyu başlatın:
```bash
npm start
```

### Frontend Kurulumu
1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyasını yapılandırın:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔒 SSL Sertifikaları
Frontend'de SSL sertifikaları `certificates/` dizininde bulunmaktadır.

## 🌐 Erişim
- Frontend: https://localhost:3000
- Backend API: http://localhost:3001

## 📝 Lisans
Bu proje MIT lisansı altında lisanslanmıştır. 