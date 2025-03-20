import { themeStore } from "./store/themeStore";
import HomePage from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { authStore } from "./store/authStore";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import AddSolution from "./pages/AddSolution";
import { LoaderCircle } from "lucide-react";

const adminEmails = import.meta.env.VITE_ADMIN_EMAILS.split(",");

function App() {
  const { theme } = themeStore();
  const { user, isLoading, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading && !user) {
    return (
      <div data-theme={theme} className="flex bg-base-200 flex-col items-center justify-center h-screen">
        <LoaderCircle className="size-10 mb-3 animate-spin" />
        <h1 className="font-extralight tracking-wider">Please Wait...</h1>
      </div>
    );
  }

  return (
    <div data-theme={theme} className="w-full font-serif bg-base-200">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/register" />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/register" />}
        />
        <Route
          path="/addSolution"
          element={
            user && adminEmails.includes(user?.email) ? (
              <AddSolution />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="*"
          element={
            <h1 className="text-5xl font-extrabold mt-52">
              Oops!...Page Not found.
            </h1>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
