# Q4 - ERP Admin Panel (Express + Mongoose + EJS + Session)

- Admin login with `express-session` (default admin is created on first run: **admin / admin123**, password stored as bcrypt hash).
- CRUD for employees. Emp ID is generated (EMP1001, EMP1002, ...) and a random password is generated.
- Employee password is encrypted with `bcryptjs` before saving.
- Salary calculation: HRA = 20%, DA = 10%, PF = 12% of basic. Gross = Basic + HRA + DA, Net = Gross - PF.
- Welcome email with Emp ID and password is sent using `nodemailer` when an employee is added.
  The generated password is also shown once to the admin after adding (handy if mail is not set up).
- Logout destroys the session.

## Setup
1. MongoDB running locally (or Atlas).
2. Copy `.env.example` to `.env` and fill values:
   - `MONGO_URI` - e.g. `mongodb://127.0.0.1:27017/erpdb`
   - `SESSION_SECRET` - any string
   - `EMAIL_USER`, `EMAIL_PASS` - Gmail id and a Gmail **App Password** (placeholders right now, so mail will just log an error)

## Run
```
npm install
npm start
```
Open http://localhost:3000

Q5 uses the same `erpdb` database, so employees added here can log in there.
