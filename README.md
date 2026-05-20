# MEAN Stack Application

**Author:** Akash Pandey

**Contact:** akashdeep9226@gmail.com

This repository contains a complete MEAN stack application with:

- **Angular 20 frontend** (SSR-ready, Tailwind CSS)
- **Node.js + Express backend**
- **MongoDB** for product and order management
- **MySQL** for user authentication
- **JWT authentication** with secure login/register flow
- **Weather API integration** with a public Open-Meteo endpoint

## Project Structure

```
backend/
frontend/
```

## Setup Instructions

### Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Update MySQL and MongoDB credentials
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start backend:
   ```bash
   npm run dev
   ```
5. Run backend tests:
   ```bash
   npm test
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start Angular SSR app:
   ```bash
   npm start
   ```

## GitHub Push Instructions

1. Initialize Git in repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MEAN stack application"
   ```
2. Add remote and push:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
