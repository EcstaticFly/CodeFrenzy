import { themeStore } from "./store/themeStore";
import HomePage from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { authStore } from "./store/authStore";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import SkeletonCard from "./components/SkeletonCard";

function App() {
  const {theme} = themeStore();
  const {user, isLoading, checkAuth} =authStore();

  useEffect(() => {
    checkAuth();
 }, [checkAuth]);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-base-200">
      <div className="relative max-w-7xl mx-auto px-4 py-12">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex mt-10 items-center gap-2 px-4 py-1.5 rounded-full bg-base-300 animate-pulse w-48 h-8 mx-auto mb-6"></div>
          <div className="h-12 bg-base-300 animate-pulse w-3/4 mx-auto mb-6 rounded-full"></div>
          <div className="h-6 bg-base-300 animate-pulse w-1/2 mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto mb-12 space-y-6 flex flex-col">
          <div className="h-14 bg-base-300 animate-pulse rounded-xl w-full"></div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-24"></div>
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            <div className="ml-auto h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-24"></div>
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
            <div className="h-10 bg-base-300 animate-pulse rounded-lg w-28"></div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 max-w-3xl mx-auto">
          {Array(6).fill().map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
    );
  }

  return (
    <div data-theme={theme} className="w-full font-serif bg-base-200">
      <Navbar/>
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
