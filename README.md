# Third Party App

This is a full-stack application developed using modern web technologies.

## 🚀 Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (default)
- JWT Authentication

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ESLint

## 📁 Project Structure

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

## 🛠 Installation

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env` file:
```
PORT=3001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

## 🔒 SSL Certificates
SSL certificates are located in the `certificates/` directory in the frontend.

## 🌐 Access
- Frontend: https://localhost:3000
- Backend API: http://localhost:3001

## 📝 License
This project is licensed under the MIT License. 