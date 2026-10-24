# FindIt — Campus Lost & Found

A from-scratch Angular + Express + MongoDB starter styled after the supplied cinematic portfolio template: near-black backgrounds, glowing red display headings, white typography, generous editorial spacing, and image-led layouts.

## Requirements
- Node.js 20+
- MongoDB running locally or a MongoDB Atlas URI
- npm

## Start the backend
```powershell
cd server
copy .env.example .env
npm install
npm run dev
```
Edit `server/.env` if your MongoDB URI differs. The API defaults to `http://localhost:3000/api`.

## Start the frontend (second terminal)
```powershell
cd client
npm install
npm start
```
Open `http://localhost:4200`.

## Create the first admin
For safety, public registration always creates a STUDENT. To create an administrator, use the backend seed command:
```powershell
cd server
npm run seed:admin
```
Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `server/.env` first. Change the seed password after initial use.

## Implemented starter functionality
- Student registration and login with hashed passwords and JWT.
- Role-aware student/admin UI navigation.
- Create and browse lost/found reports with search and category filters.
- Item detail view and authenticated claim requests.
- Student dashboard for own reports and claims.
- Admin dashboard for reviewing reports and claims, including status changes.
- MongoDB persistence.

## Important
This is a full-stack starter, not a production-audited system. Configure HTTPS, rate limiting, email verification, password reset, image upload storage, privacy controls, and deployment secrets before public deployment. Photos currently use an image URL field, not an upload service. All features require MongoDB and both processes to be running.
