# Q5 - Employee Site with JWT (Express + Mongoose + React)

Uses the same MongoDB database as Q4 (`erpdb`). Employees added by the admin in Q4 log in here
with their **Emp ID** and the generated **password** (from the email / message shown in Q4).

- `backend/` - Express API, JWT login (`jsonwebtoken`), password check with `bcryptjs`
  - `POST /api/login` -> returns token
  - `GET /api/profile` (token needed)
  - `GET /api/leaves`, `POST /api/leaves` (token needed)
- `frontend/` - React (Vite) with react-router
  - Login page
  - Home page with links: Page 1 Profile, Page 2 Leave Application (Add + List), Logout
  - Token is saved in localStorage and sent as `Authorization: Bearer <token>`

## Setup
1. Run Q4 once and add an employee (note the Emp ID + password).
2. Backend:
   ```
   cd backend
   copy .env.example .env   (or cp on linux/mac)
   npm install
   npm start                 -> http://localhost:5000
   ```
   `.env` values: `MONGO_URI=mongodb://127.0.0.1:27017/erpdb`, `JWT_SECRET=any_secret`, `PORT=5000`
3. Frontend (new terminal):
   ```
   cd frontend
   npm install
   npm run dev               -> http://localhost:3000
   ```
   Vite forwards `/api` requests to the backend on port 5000.
   (If Q4 is also running on port 3000, Vite will just pick 3001 automatically.)
