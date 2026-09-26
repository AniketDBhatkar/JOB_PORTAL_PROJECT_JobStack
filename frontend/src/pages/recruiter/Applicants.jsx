import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicants, updateApplicationStatus } from "../../services/applicationService";

export default function Applicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await getApplicants(id);
      setJob(res.data?.job);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const onStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      await fetchApplicants();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  const applications = job?.applications || [];

  return (
    <div>
      <h1 className="text-3xl mb-1">Applicants</h1>
      <p className="text-muted text-sm mb-6">{job?.title}</p>

      {applications.length === 0 && <p className="text-muted text-sm">No applicants yet.</p>}

      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <div key={app._id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{app.applicant?.fullName || "Applicant"}</p>
              <p className="text-xs text-muted">{app.applicant?.email}</p>
            </div>
            <select
              className="input-field w-40"
              value={app.status}
              disabled={updatingId === app._id}
              onChange={(e) => onStatusChange(app._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
