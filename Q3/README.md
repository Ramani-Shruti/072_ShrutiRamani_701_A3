# Q3 - Express Login with Redis Session Store

Uses `express-session` + `connect-redis` + `redis`. Sessions are stored in Redis with keys like `sess:<id>`.

- `/login` - login form (users are hardcoded: admin/admin123, student/student123)
- `/dashboard` and `/profile` - protected routes
- `/logout` - destroys the session (key removed from Redis)

## Requirements
Redis server must be running on `localhost:6379`
(or set `REDIS_URL`, e.g. `REDIS_URL=redis://localhost:6379`).
On Windows you can use Memurai or run Redis in Docker: `docker run -p 6379:6379 redis`.

## Run
```
npm install
npm start
```
Open http://localhost:3000. Check sessions with `redis-cli keys "sess:*"`.
