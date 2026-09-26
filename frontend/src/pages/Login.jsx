import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res.data?.success) {
        setUser({ ...res.data.user, role: form.role });
        navigate(form.role === "recuriter" ? "/admin/companies" : "/jobs");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card p-8">
        <h1 className="text-3xl mb-1 font-display gradient-text inline-block">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Log in to continue.</p>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input-field" type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <label className="label">I am a</label>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="student" checked={form.role === "student"} onChange={onChange} className="accent-accent" />
                Job seeker
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" value="recuriter" checked={form.role === "recuriter"} onChange={onChange} className="accent-accent" />
                Recruiter
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6">
          New here? <Link to="/signup" className="text-accent hover:opacity-80 transition-opacity">Create an account</Link>
        </p>
      </div>
    </div>
  );
}