# Quick Chat App

A full-stack, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js), TypeScript, and Socket.io. It allows users to sign up, log in, chat with other users in real-time, see online statuses, and share images.

## Features

-   **User Authentication**: Secure signup and login functionality using JWT.
-   **Real-Time Messaging**: Instant messaging powered by Socket.io.
-   **One-on-One Chat**: Private conversations between users.
-   **Online Status**: See which users are currently online.
-   **Image Sharing**: Upload and send images in chats, hosted on Cloudinary.
-   **Profile Customization**: Users can update their profile picture, name, and bio.
-   **Unread Message Count**: Indicators for new, unread messages.
-   **Responsive Design**: A clean and modern UI that works on various screen sizes, built with Tailwind CSS.

## Tech Stack

**Frontend:**
-   React with TypeScript
-   Vite
-   Tailwind CSS
-   Socket.io Client
-   Axios
-   React Router
-   React Hot Toast

**Backend:**
-   Node.js
-   Express.js
-   MongoDB (with Mongoose)
-   Socket.io
-   JSON Web Tokens (JWT)
-   Bcryptjs
-   Cloudinary
-   Dotenv

## Project Structure

```
.
├── client/         # React frontend application
│   ├── src/
│   ├── context/    # React Context for Auth and Chat
│   ├── components/ # Reusable React components
│   └── pages/      # Page components
└── server/         # Node.js/Express backend server
    ├── controllers/ # Route handlers
    ├── models/      # Mongoose schemas
    ├── routes/      # API routes
    └── server.js    # Main server entry point
```

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (local instance or a cloud service like MongoDB Atlas)
-   A Cloudinary account for image hosting.

### Backend Setup

1.  **Navigate to the server directory:**
    ```sh
    cd server
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `server` directory and add the following environment variables:
    ```env
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```

4.  **Start the server:**
    ```sh
    npm run server
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the client directory:**
    ```sh
    cd client
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `client` directory and add the backend URL:
    ```env
    VITE_BACKEND_URL=http://localhost:5000
    ```

4.  **Start the client:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## API Endpoints

All routes are prefixed with `/api`.

### Auth Routes (`/auth`)

-   `POST /signup`: Register a new user.
-   `POST /login`: Log in an existing user.
-   `PUT /update-profile`: Update user's profile (name, bio, profile picture). (Protected)
-   `GET /check`: Verify user's authentication status. (Protected)

### Message Routes (`/messages`)

-   `GET /users`: Get all users for the sidebar, along with unread message counts. (Protected)
-   `GET /:id`: Get all messages for a conversation with a specific user. (Protected)
-   `POST /send/:id`: Send a message to a specific user. (Protected)
-   `PUT /mark/:id`: Mark a specific message