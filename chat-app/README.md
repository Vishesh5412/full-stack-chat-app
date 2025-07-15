# 💬 Full Stack Chat App

Whispr-A modern, real-time chat application built with Next.js, MongoDB, Zustand, and Cloudinary — featuring authentication, user profiles, media uploads, and live messaging.

## 🚀 Features

- 🔐 **Authentication**

  - Sign up / Login
  - Secure JWT token stored in HTTP-only cookies
  - Protected routes using middleware and server-side validation

- 🗨️ **Real-Time Chat**

  - One-to-one chat with dynamic routing
  - Auto-scroll, timestamps, and typing indicators (optional)

- 🧠 **Global State with Zustand**

  - Auth user stored globally
  - Zustand hydration after login

- 🧾 **Profile Management**

  - Upload profile picture (Cloudinary)
  - Update "about me" text
  - View account metadata (member since, status)

- 🖼️ **Image Uploads**

  - Profile image upload and update
  - Cloudinary image storage

- 🌈 **Responsive UI**
  - Mobile-first design
  - Scrollable chat, custom scrollbars, and themed UI

## 🛠️ Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Frontend         | React (Next.js), Tailwind CSS     |
| State Management | Zustand                           |
| Backend          | Next.js API routes                |
| Authentication   | JWT (Jose), HTTP-only cookies     |
| Database         | MongoDB (with Mongoose or native) |
| Media Storage    | Cloudinary                        |

---

## 📂 Project Structure

```bash
.
├── pages/
│   ├── index.js            # Home / login
│   ├── signup.js           # Signup page
│   ├── chat.js             # Global chat landing
│   ├── profile.js          # User profile page
│   └── api/
│       └── auth/           # Auth APIs
├── components/             # Reusable UI components
├── store/                  # Zustand store
├── utils/                  # Utility functions
├── middleware.js           # Route protection via cookies
├── public/images/          # Default images
├── styles/                 # Global CSS, Tailwind config
```
## Env variables

| Variable Name             | Description                        |
|---------------------------|------------------------------------|
| MONGODB_URI               | MongoDB connection string          |
| JWT_SECRET                | Used for signing JWT tokens        |
| NODE_ENV                  |  Production                        |
| CLOUDINARY_CLOUD_NAME     | Cloudinary cloud project name      |
| CLOUDINARY_API_KEY        | Cloudinary API key (public)        |
| CLOUDINARY_API_SECRET     | Cloudinary secret for server uploads |
 