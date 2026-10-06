# 🚀 Step-by-Step Deployment Guide (100% Free)

Deploy this MERN project in 3 simple phases matching the stack in your design:
1. **Database**: MongoDB Atlas (Cloud Database)
2. **Backend API**: Render (Node.js & Express)
3. **Frontend**: Vercel (React + Vite)

---

## Phase 1: Setup Cloud Database (MongoDB Atlas)

1. Sign up or log in at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new project and build a **Free Shared Cluster (M0)**.
3. Under **Security → Database Access**:
   - Click **Add New Database User**.
   - Choose **Password** authentication (e.g., username: `dbuser`, password: `your_password_123`).
   - Assign role **Read and write to any database**.
4. Under **Security → Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** and confirm.
5. Under **Clusters**, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string. It will look like:
   ```text
   mongodb+srv://dbuser:<password>@cluster0.abcde.mongodb.net/taskflow_db?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password).*

---

## Phase 2: Deploy Backend to Render

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for TaskFlow MERN project"
   git remote add origin https://github.com/your-username/task-manager-mern.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and create a free account.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the deployment settings:
   - **Name**: `taskflow-server` (or any unique name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Scroll down to **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = *(Your MongoDB Atlas connection string from Phase 1)*
   - `JWT_SECRET` = `your_strong_random_jwt_secret_key_12345`
   - `CLIENT_URL` = `*` *(Will update with your Vercel URL in Phase 3)*
7. Click **Create Web Service**.
8. Once deployed, Render will provide your live API URL:
   `https://taskflow-server.onrender.com`

---

## Phase 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project** and select your GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://taskflow-server.onrender.com/api`
   *(Replace with your live Render backend URL, appending `/api`)*
5. Click **Deploy**.
6. Vercel will build your React application and provide your live frontend link:
   `https://taskflow-client.vercel.app`

---

## Phase 4: Final Link-Up

1. Return to your Render backend dashboard:
   - Go to **Environment** tab.
   - Update `CLIENT_URL` to your Vercel frontend URL: `https://taskflow-client.vercel.app`
   - Save changes (Render will automatically redeploy).
2. Open your live Vercel URL in your browser:
   - Register a new account.
   - Verify task creation, status updates, calendar, and analytics in production!
