# ChronoKeepPro

ChronoKeepPro is a full-stack web application for time tracking and management. It features a Node.js/Express backend (server) and a React frontend (chronokeep-frontened), with MongoDB as the database. The project is organized for easy local development and deployment.

---

## Project Structure

```
chronokeeppro/
│
├── server/                  # Backend (Node.js/Express)
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── middleware/
│   ├── models/
│   └── routes/
│
├── chronokeep-frontened/    # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── package.json             # Root, for running both frontend and backend together
```

---

## Modules & Technologies Used

### Backend (server)
- **Node.js** & **Express.js**: REST API server
- **MongoDB**: Database for storing users and entries
- **Mongoose**: ODM for MongoDB
- **jsonwebtoken**: For authentication (JWT)
- **dotenv**: For environment variable management

#### Key Backend Modules
- `config/db.js`: MongoDB connection setup
- `middleware/auth.js`: JWT authentication middleware
- `models/user.js`, `models/entry.js`: Mongoose models
- `routes/auth.js`, `routes/entries.js`: API endpoints for authentication and entries

### Frontend (chronokeep-frontened)
- **React**: UI library
- **React Router**: For page navigation
- **Fetch/Axios**: For API requests (check your code for which is used)
- **CSS**: For styling

---

## Flow of Execution

1. **User opens the frontend** (`chronokeep-frontened`), which is served on [http://localhost:3000](http://localhost:3000) (or [http://localhost:5173](http://localhost:5173) if using Vite).
2. **User registers or logs in**. Credentials are sent to the backend (`server`) via REST API.
3. **Backend authenticates** the user, issues a JWT token, and responds.
4. **Frontend stores the token** (usually in localStorage) and uses it for authenticated requests.
5. **User can create, view, or manage time entries**. All data is stored in MongoDB via the backend API.

---

## Steps for Execution

### 1. Install Dependencies

In the project root, run:

```powershell
npm install
npm run install-all
```

This installs dependencies for both backend and frontend.

### 2. Set Up Environment Variables

Edit `server/.env` with your MongoDB URI and secrets:

```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 3. Start the Application

From the project root, run:

```powershell
npm run dev
```

This will start both the backend and frontend concurrently.

- **Backend**: [http://localhost:5001](http://localhost:5001)
- **Frontend**: [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173)

### 4. Access the App

Open your browser and go to the frontend URL. Register or log in to start using ChronoKeepPro.

---

## Notes
- Make sure MongoDB is running and accessible from your machine.
- Do not commit `.env` files or sensitive credentials to version control.
- You can customize ports and other settings in the respective `package.json` and `.env` files.

---

## License
This project is for educational and demonstration purposes.
