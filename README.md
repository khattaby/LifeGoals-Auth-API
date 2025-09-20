# LifeGoals - Personal Goal Tracker

A full-stack MERN application for personal goal tracking with user authentication and a modern, responsive UI.

## 🎯 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Goal Management**: Create, read, update, and delete personal goals
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Real-time Updates**: Dynamic goal management without page refreshes
- **Secure API**: Protected routes with authentication middleware
- **Professional UI**: Clean, modern interface with smooth animations

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - Client-side functionality
- **Font Awesome** - Icons

## 📁 Project Structure

```
LifeGoals-Auth-API/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── goalController.js  # Goal CRUD operations
│   │   └── userController.js  # User authentication
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── goalModel.js       # Goal schema
│   │   └── userModel.js       # User schema
│   ├── routes/
│   │   ├── goalRoutes.js      # Goal API routes
│   │   └── userRoutes.js      # User API routes
│   └── server.js              # Main server file
├── public/
│   ├── index.html             # Main HTML file
│   ├── script.js              # Frontend JavaScript
│   └── styles.css             # CSS styles
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LifeGoals-Auth-API.git
   cd LifeGoals-Auth-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the application**
   ```bash
   npm run server
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/users`
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: User object with JWT token

#### Login User
- **POST** `/api/users/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: User object with JWT token

#### Get User Profile
- **GET** `/api/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile information

### Goal Endpoints

#### Get All Goals
- **GET** `/api/goals`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of user's goals

#### Create Goal
- **POST** `/api/goals`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "text": "string" }`
- **Response**: Created goal object

#### Update Goal
- **PUT** `/api/goals/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "text": "string" }`
- **Response**: Updated goal object

#### Delete Goal
- **DELETE** `/api/goals/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

## 🎨 UI Features

- **Welcome Screen**: Clean landing page with authentication options
- **Responsive Forms**: Mobile-friendly login and registration forms
- **Dashboard**: Goal management interface with add/edit/delete functionality
- **Smooth Animations**: CSS transitions for better user experience
- **Modern Design**: Professional styling with consistent color scheme

## 🔧 Development

### Available Scripts

- `npm run server` - Start the development server with nodemon
- `npm test` - Run tests (placeholder)

### Development Tools

- **Nodemon** - Auto-restart server on file changes
- **Concurrently** - Run multiple commands simultaneously

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- Error handling middleware

