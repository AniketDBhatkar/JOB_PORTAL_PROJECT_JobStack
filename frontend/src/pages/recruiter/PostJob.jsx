import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJob } from "../../services/jobService";
import { getCompanies } from "../../services/companyService";

const emptyForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "",
  experience: "",
  position: "",
  companyId: "",
};

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies()
      .then((res) => setCompanies(res.data?.companies || []))
      .catch(() => setCompanies([]));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await postJob(form);
      if (res.data?.success) {
        navigate("/admin/jobs");
      } else {
        setError(res.data?.message || "Could not post job.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl mb-6">Post a job</h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {companies.length === 0 && (
        <p className="text-sm text-muted mb-4">
          You need to register a company first before posting a job.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Company</label>
          <select className="input-field" name="companyId" value={form.companyId} onChange={onChange} required>
            <option value="" disabled>Select a company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Job title</label>
          <input className="input-field" name="title" value={form.title} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field" rows={3} name="description" value={form.description} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Requirements</label>
          <textarea className="input-field" rows={2} name="requirements" value={form.requirements} onChange={onChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <input className="input-field" name="location" value={form.location} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Job type</label>
            <input className="input-field" name="jobType" value={form.jobType} onChange={onChange} placeholder="Full-time" required />
          </div>
          <div>
            <label className="label">Salary (LPA)</label>
            <input className="input-field" name="salary" value={form.salary} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Experience (yrs)</label>
            <input className="input-field" type="number" name="experience" value={form.experience} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Openings</label>
            <input className="input-field" type="number" name="position" value={form.position} onChange={onChange} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Posting..." : "Post job"}
        </button>
      </form>
    </div>
  );
}
