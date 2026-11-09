# TeamBoard API

Week 1 Express foundation for MSIS207. Requires Node.js 24.x and npm.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:3000/ and http://localhost:3000/api/v1/health.
Run `npm test` for HTTP/CORS checks. Set the DB_* values in `.env` and run `npm run db:check` to verify an existing MySQL database. No tables are created automatically. DB connection is deliberately not required for the Week 1 Hello World service.

## Render

Import this repository as a Node web service. Root directory: leave blank. Build: `npm ci`. Start: `npm start`. Health path: `/api/v1/health`. Set `NODE_VERSION=24`, `NODE_ENV=production`, and `CLIENT_URL` to the exact Vercel origin without a trailing slash. `render.yaml` provides the same settings for Blueprint deployment; choose the service plan in your account after reviewing cost. No free-tier availability is assumed.

`PORT` is supplied by the host. Store secrets in environment settings, never Git. Future authentication will require JWT_SECRET; it is intentionally not used in this milestone. MySQL cloud provisioning is a separate step and is not represented as completed.

## Endpoints

| Method | Path | Result |
| --- | --- | --- |
| GET | / | 200 Hello World JSON |
| GET | /api/v1/health | 200 status, service and database=not-checked |
| Any | Unknown route | 404 error.code=NOT_FOUND |

CORS permits the configured browser origin, plus requests without Origin such as Postman. CORS is not authentication. Production business routes will require JWT and membership checks in week 3.

Repository URL: pending creation. Live API URL: pending deployment.
