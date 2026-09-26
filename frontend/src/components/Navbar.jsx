import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          <span className="gradient-text">JobStack</span>
          <span className="gradient-text"></span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {!user && (
            <>
              <Link to="/jobs" className="hover:text-accent transition-colors">Browse Jobs</Link>
              <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
              <Link to="/signup" className="btn-primary text-xs py-2">Sign Up</Link>
            </>
          )}

          {user && user.role === "student" && (
            <>
              <Link to="/jobs" className="hover:text-accent transition-colors">Jobs</Link>
              <Link to="/applied-jobs" className="hover:text-accent transition-colors">Applied</Link>
              <Link to="/profile" className="hover:text-accent transition-colors">Profile</Link>
              <button onClick={handleLogout} className="btn-outline text-xs py-2">Logout</button>
            </>
          )}

          {user && user.role === "recuriter" && (
            <>
              <Link to="/admin/companies" className="hover:text-accent transition-colors">Companies</Link>
              <Link to="/admin/jobs" className="hover:text-accent transition-colors">My Jobs</Link>
              <button onClick={handleLogout} className="btn-outline text-xs py-2">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}