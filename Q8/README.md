# Q8 - Student CRUD with Sequelize (Express + Sequelize + React)

- `backend/` - Express + Sequelize ORM with **SQLite** (database is a file `students.sqlite`, created automatically, no DB server needed).
  To use MySQL instead, install `mysql2` and change the connection in `db.js` (example is commented there).
  - `GET /api/students` - list
  - `GET /api/students/:id` - one
  - `POST /api/students` - add
  - `PUT /api/students/:id` - update
  - `DELETE /api/students/:id` - delete
  - Model validations: rollNo unique, email must be valid, marks 0 to 100
- `frontend/` - React (Vite): form to add/edit + table with Edit/Delete buttons

## Run
```
cd backend
npm install
npm start          -> http://localhost:5000
```
```
cd frontend
npm install
npm run dev        -> http://localhost:3000   (/api is forwarded to port 5000)
```
