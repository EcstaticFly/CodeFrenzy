import { Code2, LogOut, Moon, RefreshCw, SunMedium, User } from "lucide-react";
import { Link } from "react-router-dom";
import { authStore } from "../store/authStore";
import { themeStore } from "../store/themeStore";
import { contestStore } from "../store/contestStore";

export default function Navbar() {
  const { user, logout } = authStore();
  const { theme, setTheme } = themeStore();
    const { getAllContests, fetchBookmarks } = contestStore();

  //For manual refresh
  const handleRefresh = () => {
    getAllContests(true); //Force refresh
    if (user && user._id) {
      fetchBookmarks(true); //Force refresh
    }
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-10 rounded-lg flex items-center justify-center">
                <img
                  src="/codeFrenzy.png"
                  className="size-10 text-primary"
                  alt="CodeFrenzy logo"
                />
              </div>
              <h1 className="text-lg font-bold hidden min-[360px]:block">
                CodeFrenzy
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="btn btn-sm gap-2"
              onClick={() =>
                setTheme(`${theme === "light" ? "dark" : "light"}`)
              }
            >
              {theme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <SunMedium className="size-4" />
              )}
              <span className="hidden sm:inline">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </div>

            {user ? (
              <>
                <div
              className="btn btn-sm gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="size-4" />
              <span className="hidden sm:inline">Refresh</span>
            </div>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
