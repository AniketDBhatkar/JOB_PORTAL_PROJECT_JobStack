import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppliedJobs } from "../services/applicationService";

const statusStyles = {
  pending: "border-line text-muted",
  accepted: "border-accent text-accent",
  rejected: "border-accent2 text-accent2",
};

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAppliedJobs();
        setApplications(res.data?.application || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div >
      <h1 className="text-3xl mb-6 font-display gradient-text inline-block">Applied jobs</h1>

      {loading && <p className="text-muted text-sm">Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && applications.length === 0 && (
        <p className="text-muted text-sm">
          You haven't applied to any jobs yet. <Link to="/jobs" className="text-accent hover:opacity-80 transition-opacity">Browse jobs</Link>
        </p>
      )}

      <div className="flex flex-col gap-3 ">
        {applications.map((app) => (
          <div key={app._id} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="font-medium">{app.job?.title || "Job removed"}</p>
              <p className="text-xs text-muted">{app.job?.company?.name}</p>
            </div>
            <span
              className={`text-xs uppercase tracking-wide border px-2 py-1 rounded-sm ${
                statusStyles[app.status?.toLowerCase()] || "border-line text-muted"
              }`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}