# CodeFrenzy Documentation

## 1. Product Overview
The **CodeFrenzy** is a MERN stack application designed to track programming contests from platforms like Codeforces, CodeChef, and Leetcode. It provides features such as:
- **Real-Time Contest Tracking**
- **Filtering contests by platform or status**
- **Bookmarking contests for future reference**
- **Automatic YouTube solution integration**
- **Dark/Light mode toggle**
- **User authentication (Sign-up, Login, Logout)**
- **Responsive and user-friendly UI**
- **Scalable MERN stack architecture**

The backend is built with Node.js, Express, and MongoDB, while the frontend is built with React and TailwindCSS. The project is licensed under the GNU GENERAL PUBLIC LICENSE v3.

## 2. Tech Stack
- **Frontend:** React, TailwindCSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **API Fetching & Scheduling:** Cron jobs
- **Database:** MongoDB

## 3. APIs
### Authentication Routes
- **Base URL:** `/api/auth`
- **Endpoints:**
  - `POST /register` - Registers a new user.
  - `POST /login` - Logs in a user and returns a token.
  - `POST /logout` - Logs out a user by invalidating the token.
  - `GET /check` - Verifies if the user is authenticated using JWT.
  - `POST /sendOtp` - Sends an OTP for verification.
  - `POST /verifyOtp` - Verifies the provided OTP.

### Contest Routes
- **Base URL:** `/api/contests`
- **Endpoints:**
  - `GET /all` - Fetches all upcoming and past contests from Codeforces, CodeChef, and Leetcode.
  - `POST /addSolution` - Allows admins to add YouTube solution links for contests. Requires admin authentication.

### Bookmark Routes
- **Base URL:** `/api/bookmarks`
- **Endpoints:**
  - `POST /add` - Adds a contest to the user's bookmarks. Requires JWT verification.
  - `DELETE /delete/:id` - Deletes a specific bookmark by ID. Requires JWT verification.
  - `GET /:userId` - Retrieves all bookmarks for a specific user. Requires JWT verification.

## 4. Interfaces
### Frontend Interfaces (UI)
- **Home Page:** Displays a list of upcoming and past contests with filtering and bookmarking options.
- **Profile Page (Bookmarks):** Shows all bookmarked contests of the user.
- **Register & Login Pages:** Provides authentication features with JWT-based login.
- **AddSolution Page (Admin Only):** Allows admins to add YouTube solution links for past contests. Accessible via a button on each contest card (if user is an admin).
- **Contest Details Page:** Displays contest details with attached YouTube links (if available).

### API Interfaces (Backend)
- **Endpoints:** See APIs section above.
- **Request Format:** JSON requests for POST and DELETE methods.
- **Response Format:** JSON responses with relevant data or error messages.
- **Authentication:** Token-based authentication using JWT for protected routes.

### Integration Interfaces
- **Third-Party APIs:**
  - **Contest Fetching APIs:**
    - **Codeforces API:** Fetches upcoming and past contests from Codeforces.
    - **CodeChef API:** Fetches upcoming and past contests from CodeChef.
    - **Leetcode API:** Fetches upcoming and past contests from Leetcode.
  - **YouTube Data API:** Fetches Post-Contest Discussion (PCD) videos related to contests.
- **Frontend to Backend Communication:** Via Axios requests to the backend endpoints for authentication, bookmarking, and fetching contest data.
- **YouTube API Fetching:** Fetching relevant video links every 6 hours via cron jobs.
- **Contest Fetching:** Fetching contest data every 2 hours via cron jobs.

### Page Interfaces

#### AddSolution Page (Admin Only)
- Allows admins to add YouTube solution links for past contests.
- Accessible via a button on each contest card if the user is an admin.
- Sends a POST request to `/api/contests/addSolution` to save the YouTube link.

#### Home Page
- Displays a list of contests.
- Allows filtering by platform or status.
- Shows contests with titles, platforms, start times, contest url, and discussion links if available.

#### Register Page
- Allows new users to create an account by providing username, email, and password.
- Includes OTP-based email verification for account activation.

#### Login Page
- Allows users to log in with email and password.
- Returns a JWT token for authentication.

#### Profile Page
- Displays the user's bookmarked contests.
- Allows users to remove bookmarks.

### Data Interfaces
#### Contest Object
```typescript
interface Contest {
  id: string;
  title: string;
  site: 'Codeforces' | 'Codechef' | 'Leetcode';
  url: string;
  startTime: string;
  duration: number;
  contestStatus: 'UPCOMING' | 'FINISHED';
  youtubeLink?: string;
}
```

#### Bookmark Object
```typescript
interface Bookmark {
  id: string;
  userId: string;
  contestId: string;
}
```

#### User Object
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}
```

## 5. Configuration and Setup
### Environment Variables
#### Backend
Create a `.env` file in the root of your backend directory and add the following:
```
MONGODB_URL=your_mongodb_url
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email_user
SECRET_PASSWORD=your_email_app_password
YOUTUBE_API_KEY=your_youtube_api_key
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

#### Frontend
Create a `.env` file in the root of your frontend directory and add the following:
```
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### Installation
1. Clone the repository from GitHub.
2. Install dependencies using `npm install` for both frontend and backend.
3. Set up environment variables as described above.
4. Run the backend using `npm run start`.
5. Run the frontend using `npm run dev`.

## 6. Contribution Guidelines
Feel free to contribute to **CodeFrenzy**! To contribute:
- Fork the repository.
- Create a new branch (`git checkout -b feature-branch-name`).
- Make your changes and commit them (`git commit -m 'Add some feature'`).
- Push to the branch (`git push origin feature-branch-name`).
- Create a Pull Request.

## 7. License
This project is licensed under the **GNU GENERAL PUBLIC LICENSE v3**.

## 8. Contact
For any inquiries or collaboration, you can reach me at: [Suyash Pandey](mailto:suyash.2023ug1100@iiitranchi.ac.in).

## 9. Source Code
- [GitHub Link](https://github.com/EcstaticFly/CodeFrenzy.git)
- Description: Contains the full codebase for the CodeFrenzy project, including both frontend and backend implementations.

## 10. Video Link
- [Video Demo](https://drive.google.com/file/d/1dM7WptmwmyTSEH6NZzLa1D-J5NSmdE7J/view?usp=sharing)

---

