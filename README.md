# CalClone: MERN Stack Monorepo Scheduling Platform

CalClone is a production-grade self-hosted clone of Cal.com built using npm workspaces. It features high-performance dynamic timezone calculations, robust race-condition booking prevention, and structured Next.js 15 pages.

## Project Structure

*   `apps/web`: Next.js 15 App Router Frontend built with TypeScript, Tailwind CSS, and Framer Motion.
*   `apps/server`: Node.js Express.js backend containing standard MongoDB connection bootstrap, security middleware configuration, rate limiting, and core timezone-resilient slot generator algorithms.
*   `packages/`: Shared configurations and TypeScript types.
*   `PRODUCT_PLANNING.md`: Full architectural blueprint, including Mongoose schemas, REST APIs, Git conventions, phase roadmap, and scaling plans.

## Getting Started

### 1. Configure Environment Variables

Create `.env` inside `apps/server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/calclone
CLIENT_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secure_jwt_secret_phrase
```

### 2. Install Workspace Dependencies

From the root directory:

```bash
npm install
```

### 3. Run Development Servers

Run the frontend and backend servers concurrently:

```bash
# Start Next.js frontend (Port 3000)
npm run dev:web

# Start Express.js backend (Port 5000)
npm run dev:server
```

---
*CalClone SDE Internship Project.*
