import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById, updateCompany } from "../../services/companyService";

export default function CompanySetup() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "", website: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCompanyById(id);
        const c = res.data?.company;
        setForm({
          name: c?.name || "",
          description: c?.description || "",
          website: c?.website || "",
          location: c?.location || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load company.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const res = await updateCompany(id, form);
      setMessage(res.data?.message || "Saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading...</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-3xl mb-6">Company details</h1>

      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Name</label>
          <input className="input-field" name="name" value={form.name} onChange={onChange} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field" rows={3} name="description" value={form.description} onChange={onChange} />
        </div>
        <div>
          <label className="label">Website</label>
          <input className="input-field" name="website" value={form.website} onChange={onChange} placeholder="https://" />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input-field" name="location" value={form.location} onChange={onChange} />
        </div>

        <button type="submit" disabled={saving} className="btn-primary mt-2">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
