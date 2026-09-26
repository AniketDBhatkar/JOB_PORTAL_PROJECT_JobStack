import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminJobs } from "../../services/jobService";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminJobs();
        setJobs(res.data?.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">My job postings</h1>
        <Link to="/admin/jobs/post" className="btn-primary">+ Post a job</Link>
      </div>

      {loading && <p className="text-muted text-sm">Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-muted text-sm">No jobs posted yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <div key={job._id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{job.title}</p>
              <p className="text-xs text-muted">{job.location} &middot; {job.jobType}</p>
            </div>
            <Link to={`/admin/jobs/${job._id}/applicants`} className="btn-outline text-xs py-2">
              View applicants
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
