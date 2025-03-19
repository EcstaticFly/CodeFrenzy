import { Code2, LogOut, Moon, SunMedium, User } from "lucide-react";
import { Link } from "react-router-dom";
import { authStore } from "../store/authStore";
import { themeStore } from "../store/themeStore";

export default function Navbar() {
  const { user, logout } = authStore();
  const {theme, setTheme} = themeStore();
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold hidden min-[290px]:block">CodeFrenzy</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="btn btn-sm gap-2" onClick={()=> setTheme(`${theme === 'light' ? 'dark' : 'light'}`)}>
              {
                theme === 'light' ?  <Moon className="size-4"/> :<SunMedium className="size-4"/>
              }
              <span className="hidden sm:inline">
                {
                  theme === 'light' ? 'Dark' : 'Light'
                }
              </span>
            </div>

            {user ? (
              <>
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
