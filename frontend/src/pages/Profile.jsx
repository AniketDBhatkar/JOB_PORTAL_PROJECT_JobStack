import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await updateProfile(form);
      if (res.data?.success) {
        setUser({ ...user, ...res.data.user, role: user.role });
        setMessage(res.data.message);
      } else {
        setError(res.data?.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="card p-8">
        <h1 className="text-3xl mb-6 font-display gradient-text inline-block">Your profile</h1>

        {message && <p className="text-sm text-green-700 mb-4">{message}</p>}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Full name</label>
            <input className="input-field" name="fullName" value={form.fullName} onChange={onChange} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" name="email" value={form.email} onChange={onChange} />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input className="input-field" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input-field" rows={3} name="bio" value={form.bio} onChange={onChange} />
          </div>
          <div>
            <label className="label">Skills (comma separated)</label>
            <input className="input-field" name="skills" value={form.skills} onChange={onChange} placeholder="React, Node.js, MongoDB" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}