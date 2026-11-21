# 🎬 Doomsday Ready

**Plan your MCU marathon. Book your opening night. Prepare for Doomsday.**

Doomsday Ready is a full-stack application that helps Marvel fans prepare for *Avengers: Doomsday* by organizing movie rewatch orders, tracking watch progress, and calculating optimal cinema seat bundles for group bookings.

## ✨ Features

- **Movie Management:** Add movies, track watched status, and manage movie information.
- **Smart Rewatch Planner:** Automatically generates prerequisite watch orders without duplicates.
- **Watch Progress:** Tracks watched movies and calculates remaining watch time.
- **Circular Dependency Detection:** Prevents invalid movie relationships using graph traversal.
- **Smart Booking Calculator:** Finds the minimum number of seat bundles required to match a group size exactly.
- **Responsive UI:** Interactive interface with animated components and mobile-friendly navigation.

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| React 19 | Node.js | MongoDB |
| Vite | Express.js 5 | MongoDB Native Driver |
| Tailwind CSS 4 | REST API | |
| GSAP | JavaScript | |

## 🧠 Core Algorithms

- **Depth-First Search (DFS):** Detects circular dependencies and generates a valid rewatch order.
- **Dynamic Programming:** Calculates the minimum number of cinema bundles required for an exact seat match.

## 📁 Project Structure

```text
Doomsday-Ready/
├── DoomsDay-Client/
│   └── src/
│       ├── components/
│       ├── api.js
│       └── App.jsx
│
├── DoomsDay-Server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
└── README.md


Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/movies` | Create a movie |
| GET | `/api/movies` | Get all movies |
| PATCH | `/api/movies/:id` | Update a movie |
| GET | `/api/movies/:id/rewatch-order` | Generate rewatch order |
| POST | `/api/cinemas` | Create a cinema |
| GET | `/api/cinemas` | Get all cinemas |
| GET | `/api/cinemas/:id/booking?groupSize=6` | Calculate booking bundles |

## ⚠️ Current Limitations

- Movie prerequisite editing is currently API-only; frontend editing UI is not implemented.
- Cinema creation is currently API-only.
- Booking UI supports group sizes from 1–30, while the backend currently supports up to 1,000. The original assessment requires 10,000.
- No automated test suite or production deployment configuration yet.

## 🤖 AI Usage Disclosure

- **Backend:** Personally structured and developed the backend and core algorithmic logic. AI assistance was used for selected repetitive implementation patterns, which were reviewed and integrated.
- **Frontend:** Used **Claude and Google Antigravity** for AI-assisted UI development, React components, styling, animations, and responsive layouts. Reviewed and integrated the frontend with the backend APIs.

## 👨‍💻 Author

**Yajuddin Raju** — Full Stack Developer

 [LinkedIn]
https://www.linkedin.com/in/yajuddin
 [Portfolio]
https://myportfolio-raju.vercel.app/

---

*Built with passion for Marvel fans and full-stack development.* ❤️
