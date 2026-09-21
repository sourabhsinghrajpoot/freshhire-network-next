# FreshHire Network — Next.js + MongoDB

Production-ready job portal with a protected admin dashboard. Jobs are stored in MongoDB, so additions and changes persist and show on the public site as soon as they are published.

## Local setup

1. Copy `.env.example` to `.env.local` and configure a MongoDB Atlas connection string plus secrets.
2. Create a password hash: `pnpm create-admin "your-password"`; add the returned value as `ADMIN_PASSWORD_HASH` to `.env.local` (then remove `ADMIN_PASSWORD`).
3. Install packages: `pnpm install`.
4. Add safe demo data if desired: `pnpm seed`.
5. Run: `pnpm dev`, then visit `http://localhost:3000` and `http://localhost:3000/admin/login`.

## Deployment

Deploy on Vercel, Railway, Render, or another Node-compatible host. Add the same environment variables there and configure MongoDB Atlas network access for the host. Never commit `.env.local`.
