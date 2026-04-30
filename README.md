# 🍳 Recipe Sharing Platform

A modern, full-stack web application for sharing, discovering, and managing recipes. Built with React, Express.js, and MySQL, featuring user authentication, chef profiles, recipe management, comments, and bookmarks.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
  - [MySQL Installation by Platform](#mysql-installation-by-platform)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Role-based access control (User, Chef, Admin)
- Email and password validation
- Secure cookie-based sessions

### 👨‍🍳 Chef Features
- Create and manage recipes with ingredients and instructions
- Upload recipe images with drag-and-drop support
- View recipe analytics and creation dashboard
- Track recipe performance metrics
- Edit and delete recipes

### 🍽️ Recipe Management
- Browse all recipes with category filtering
- Search recipes by title and category
- View detailed recipe information
- Upload and manage recipe images
- Categorized recipe organization

### 💬 Community Features
- Add comments and reviews to recipes
- Rate recipes (1-5 stars)
- Like comments
- Track recipe engagement

### 📌 User Features
- Bookmark favorite recipes
- Create user profiles with customization
- Manage dietary preferences and skill level
- Upload and change profile avatar
- Track cooking history
- Follow other users
- View follower and following lists

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Component library with Radix UI
- Toast notifications with Sonner
- Drag-and-drop file uploads
- Real-time form validation
- Admin dashboard with analytics

### 📁 File Management
- Avatar image uploads for users
- Recipe image uploads
- Multer-based file handling
- Automatic cleanup of orphaned files
- Static file serving

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web framework
- **MySQL 8.0+** - Relational database
- **mysql2 3.22.0** - MySQL client
- **JWT** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing
- **Multer 2.1.1** - File uploads
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - URL routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Headless component library
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **TanStack Query** - Data fetching (optional)

---

## 📦 Prerequisites

Before installing, ensure you have:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Installation Guide Below](#mysql-installation-by-platform)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v14+
npm --version     # Should be v6+
mysql --version   # Should be v8+
```

---

## 💾 Database Setup

### MySQL Installation by Platform

#### **Windows**

##### Option 1: Using MySQL Installer (Recommended)
1. Download [MySQL Installer](https://dev.mysql.com/downloads/installer/) (64-bit recommended)
2. Run the installer and follow the setup wizard
3. Choose "Developer Default" or "Server only"
4. Configure MySQL Server:
   - Port: `3306`
   - MySQL User: `root`
   - Password: Choose a strong password
5. Configure MySQL Workbench (optional but recommended)
6. Click "Execute" to install

##### Option 2: Using Chocolatey
```bash
choco install mysql
```

##### Option 3: Using Windows Subsystem for Linux (WSL2)
```bash
# Inside WSL2 terminal
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Verify Installation:**
```bash
mysql --version
mysql -u root -p  # Enter your password when prompted
```

---

#### **macOS**

##### Option 1: Using Homebrew (Recommended)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

##### Option 2: Using DMG Installer
1. Download [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) for macOS
2. Run the `.dmg` installer
3. Follow the installation wizard
4. Note the temporary root password displayed at the end
5. Open System Preferences → MySQL and start the server

**Verify Installation:**
```bash
mysql --version
mysql -u root -p  # Use the password you set
```

---

#### **Linux (Ubuntu/Debian)**

```bash
# Update package list
sudo apt update

# Install MySQL Server
sudo apt install mysql-server -y

# Run security installation script
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql  # Enable on boot

# Verify installation
sudo systemctl status mysql
mysql --version
```

**Access MySQL:**
```bash
# As root (no password if you didn't set one)
sudo mysql

# Or with a user account
mysql -u your_username -p
```

---

#### **Linux (Fedora/CentOS/RHEL)**

```bash
# Install MySQL Server
sudo dnf install mysql-server -y

# Start and enable MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Run security installation
sudo mysql_secure_installation

# Verify installation
sudo systemctl status mysqld
mysql --version
```

---

#### **Docker (All Platforms)**

```bash
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run --name recipe-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=recipe_db \
  -p 3306:3306 \
  -d mysql:8.0

# Verify the container is running
docker ps

# Access MySQL
mysql -h 127.0.0.1 -u root -p
```

---

### Create Database

After MySQL is installed, create the database:

```bash
# Access MySQL
mysql -u root -p
# Enter your password when prompted

# Inside MySQL shell, run:
CREATE DATABASE recipe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'recipe_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON recipe_db.* TO 'recipe_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Or use a single command:**
```bash
mysql -u root -p -e "
CREATE DATABASE recipe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'recipe_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON recipe_db.* TO 'recipe_user'@'localhost';
FLUSH PRIVILEGES;
"
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd "User Experience Design Strategy (1)"
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # If available, or create it manually
```

**Edit `.env` file:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=recipe_user
DB_PASSWORD=strong_password
DB_NAME=recipe_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # If available, or create it manually
```

**Edit `.env` file:**
```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

---

## 🔧 Environment Variables

### Backend (`.env`)
| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `3306` | Database port |
| `DB_USER` | `recipe_user` | Database user |
| `DB_PASSWORD` | `strong_password` | Database password |
| `DB_NAME` | `recipe_db` | Database name |
| `JWT_SECRET` | `your_secret_key` | JWT signing key |
| `JWT_EXPIRE` | `7d` | JWT expiration time |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |

### Frontend (`.env`)
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API base URL |

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd Backend
npm start
```

Expected output:
```
> node server.js
🚀 Server running on http://localhost:3000
🗄️  Database connected successfully
```

### Terminal 2: Start Frontend Development Server

```bash
cd Frontend
npm run dev
```

Expected output:
```
> vite
VITE v... dev server running at:

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

---

## 📂 Project Structure

```
.
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   ├── database.js        # Database connection
│   │   │   └── multer.config.js   # File upload config
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── recipe.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── comment.controller.js
│   │   │   └── upload.controller.js
│   │   ├── middleware/            # Custom middleware
│   │   │   └── auth.middleware.js
│   │   ├── models/                # Data models
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── recipe.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── comment.routes.js
│   │   │   └── upload.routes.js
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── recipe.service.js
│   │   │   ├── user.service.js
│   │   │   ├── comment.service.js
│   │   │   └── upload.service.js
│   │   └── utils/
│   ├── uploads/                   # User-uploaded files
│   │   ├── avatars/
│   │   ├── recipes/
│   │   └── courses/
│   ├── package.json
│   └── server.js                  # Entry point
│
├── Frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/            # React components
│   │   │   ├── ui/                # Radix UI components
│   │   │   ├── RecipeCard.tsx
│   │   │   └── Navigation.tsx
│   │   ├── context/               # React context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── chef/
│   │   │   │   ├── AddRecipe.tsx
│   │   │   │   ├── EditRecipe.tsx
│   │   │   │   └── ManageRecipes.tsx
│   │   │   └── userprofile/
│   │   │       └── UserProfile.tsx
│   │   ├── routes/                # Route definitions
│   │   ├── services/              # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── chefServices.js
│   │   │   ├── userService.js
│   │   │   ├── commentsService.js
│   │   │   └── recipesService.js
│   │   ├── data/                  # Models & mock data
│   │   ├── assets/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md                      # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Recipe Endpoints
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe details
- `POST /api/recipes` - Create recipe (Chef only)
- `PUT /api/recipes/:id` - Update recipe (Chef only)
- `DELETE /api/recipes/:id` - Delete recipe (Chef only)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `GET /api/users/bookmarks` - Get bookmarked recipes
- `POST /api/users/bookmarks/:recipeId` - Bookmark recipe

### Comment Endpoints
- `GET /api/comments/:recipeId` - Get recipe comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment

### File Upload Endpoints
- `POST /api/uploads/avatar` - Upload user avatar
- `DELETE /api/uploads/avatar` - Delete user avatar
- `GET /api/uploads/avatar/me` - Get current user's avatar
- `POST /api/uploads/recipe` - Upload recipe image
- `PUT /api/uploads/recipe/:id` - Update recipe image
- `DELETE /api/uploads/recipe/:id` - Delete recipe image
- `GET /api/uploads/recipe/:id` - Get recipe image
- `GET /api/uploads/stats` - Storage statistics (Admin)
- `POST /api/uploads/cleanup` - Cleanup orphaned files (Admin)

---

## 📱 Usage Guide

### 1. Register a New Account

1. Click "Sign Up" on the home page
2. Enter your email, password, and name
3. Select your role (User or Chef)
4. Click "Create Account"
5. You'll be redirected to login
6. Log in with your credentials

### 2. Create a Recipe (Chef Users)

1. Log in as a Chef
2. Navigate to "Add Recipe" or "Manage Recipes"
3. Fill in recipe details:
   - Title, description, category
   - Difficulty level, cook time, servings
4. **Upload Recipe Image**: Drag and drop or click "Browse Files"
5. Add ingredients and instructions
6. Click "Add Recipe"

### 3. Browse and Search Recipes

1. Go to the Home page
2. Filter by category using the dropdown
3. Search recipes by keywords
4. Click on a recipe to view details

### 4. Add Comments and Reviews

1. Open a recipe detail page
2. Scroll to comments section
3. Enter your review and rating
4. Click "Post Comment"
5. Like other users' comments

### 5. Bookmark Recipes

1. Open a recipe
2. Click the bookmark icon
3. View bookmarks in your profile

### 6. Update Profile

1. Navigate to "My Profile"
2. Edit your personal information
3. **Upload Avatar**: Click "Change Photo" or drag-and-drop
4. Update dietary preferences
5. Click "Save Changes"

### 7. Follow Other Users

1. Visit another user's profile
2. Click the "Follow" button
3. View your followers/following list

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error: "Connection refused at 127.0.0.1:3306"**

```bash
# Check if MySQL is running
# Windows
Get-Service MySQL80  # or your version

# macOS
brew services list

# Linux
sudo systemctl status mysql

# Start MySQL if not running
# Windows (as Administrator)
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

**Error: "Access denied for user 'recipe_user'@'localhost'"**

```bash
# Verify credentials in .env file
# Re-create user with correct password
mysql -u root -p
DROP USER 'recipe_user'@'localhost';
CREATE USER 'recipe_user'@'localhost' IDENTIFIED BY 'new_password';
GRANT ALL PRIVILEGES ON recipe_db.* TO 'recipe_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Port Already in Use

**Error: "Port 3000 is already in use"**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Error: "Port 5173 is already in use"**

```bash
# Change port in Frontend
npm run dev -- --port 5174
```

### File Upload Issues

**Error: "Failed to upload avatar"**

1. Check if `uploads/avatars/` directory exists
2. Verify write permissions: `chmod 755 uploads/`
3. File size limit: Max 5MB
4. Supported formats: JPG, PNG, GIF, WebP

### Frontend Cannot Connect to Backend

**Error: "Cannot GET /api/..."**

1. Verify backend is running on port 3000
2. Check `VITE_API_URL` in Frontend `.env`
3. Ensure CORS is enabled in Backend
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MySQL Authentication Fails

```bash
# Reset root password (Linux/macOS)
sudo mysql_safe --skip-grant-tables &
mysql -u root
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
EXIT;

# Kill the safe mode process
sudo killall mysqld
sudo systemctl start mysql
```

---

## 📋 Quick Start Checklist

- [ ] Install Node.js and npm
- [ ] Install MySQL
- [ ] Create database and user
- [ ] Clone the repository
- [ ] Set up Backend environment variables
- [ ] Set up Frontend environment variables
- [ ] Install Backend dependencies
- [ ] Install Frontend dependencies
- [ ] Start Backend server
- [ ] Start Frontend dev server
- [ ] Access application at http://localhost:5173
- [ ] Create test account
- [ ] Test recipe creation/upload
- [ ] Test avatar upload

---

## 📝 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 💬 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Contact the development team

---