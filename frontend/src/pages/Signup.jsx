import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerUser(form);
      if (res.data?.success) {
        navigate("/login");
      } else {
        setError(res.data?.message || "Registration failed");
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
        <h1 className="text-3xl mb-1 font-display gradient-text inline-block">Create account</h1>
        <p className="text-muted text-sm mb-8">Join Hirely to find or post jobs.</p>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Full name</label>
            <input className="input-field" name="fullName" value={form.fullName} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input className="input-field" type="tel" name="phoneNumber" value={form.phoneNumber} onChange={onChange} required />
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
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6">
          Already have an account? <Link to="/login" className="text-accent hover:opacity-80 transition-opacity">Log in</Link>
        </p>
      </div>
    </div>
  );
}