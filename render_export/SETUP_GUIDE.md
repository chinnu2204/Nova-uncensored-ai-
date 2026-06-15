# Nova AI Platform - Render.com Deployment Setup Guide

This guide describes how to deploy the **Nova AI** platform in production using [Render.com](https://render.com) with a complete PostgreSQL database, Next.js frontend, and FastAPI backend structure.

---

## Architecture Components

1. **Databases**: PostgreSQL Managed Database Instance (Free Tier).
2. **Backend**: Python-based FastAPI web application.
3. **Frontend**: Static or interactive Node.js Single Page Application (Next.js).

---

## Step 1: Push Project to GitHub

1. Ensure all your configuration files matching the `/render_export` structure are placed in your repository root.
2. Initialize and push your repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of Nova AI platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/nova-ai-platform.git
   git push -u origin main
   ```

---

## Step 2: One-Click Render Blueprints

Render offers standard Blueprints via the `render.yaml` specification located in this export pack.

1. Log in to your account at [Render Dashboard](https://dashboard.render.com).
2. Click **Blueprints** in the top navigation panel.
3. Select **New Blueprint Instance**.
4. Connect your newly pushed GitHub repository containing this project structure.
5. Review the resources described in your `render.yaml` pipeline:
   - **Service**: `nova-ai-backend` (FastAPI)
   - **Service**: `nova-ai-frontend` (Next.js client)
   - **Database**: `nova-postgres-db` (PostgreSQL)
6. Click **Approve** to build all services synchronously.

---

## Step 3: Configure Env Variables in Render Dashboard

Go to **Dashboard > web service (nova-ai-backend) > Environment**:

Add these required secrets corresponding to your AI engines:
- `GEMINI_API_KEY`: Fetch your API key from [Google AI Studio](https://aistudio.google.com).
- `JWT_SECRET`: Any complex master secure alphanumeric string used to encrypt session tokens.
- `Database URL` (`DATABASE_URL`): Loaded automatically from your provisioned `nova-postgres-db`.

For the **Frontend web service (nova-ai-frontend) > Env**:
- Check that `NEXT_PUBLIC_API_URL` points directly to your API service web address (e.g. `https://nova-ai-backend.onrender.com`).

---

## Step 4: Access Your Premium Terminal

Once Render wraps the compilation pipeline:
- Your API backend will operate on port `10000` or dynamically mapped.
- Your Next.js views will build static HTML pages and serve them via high-performance edge servers.
- Database schemas are initialized automatically using SQLAlchemy metadata generators!

*Congratulations, your futuristic mobile-first AI ecosystem is now live!*
