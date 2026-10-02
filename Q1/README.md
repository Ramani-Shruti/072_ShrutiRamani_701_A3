# Q1 - User Registration Form (Express + EJS + express-validator)

Fields: username, password, confirm password, email, gender (radio), hobbies (checkbox),
profile pic (single file upload), other pics (multiple file upload).

- Invalid data -> form shows errors and keeps old values (except files, browsers can't refill those).
- Valid data -> shows everything in a table with images.
- Each image has a Download link which uses the `/download/:name` route (`res.download`).

File validations: only jpg/png/gif, max 2 MB each, profile pic required, 1 to 5 other pics.

## Run
```
npm install
npm start
```
Open http://localhost:3000
