import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyToJob } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";

export default function JobDescription() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getJobById(id);
        setJob(res.data?.job);
      } catch (err) {
        // See the note in jobService.js: getJobById will 500 until the
        // req.param.id / res.status.json bugs are fixed in job.controller.js.
        setError(err.response?.data?.message || "Could not load this job. (Check the backend getJobById fix noted in jobService.js.)");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const onApply = async () => {
    setApplying(true);
    setMessage("");
    try {
      const res = await applyToJob(id);
      setMessage(res.data?.message || "Applied successfully.");
      setApplied(true);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.messsage || "Could not apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!job) return null;

  return (
    <div className="max-w-2xl">
      <span className="text-xs uppercase tracking-widest text-muted">{job.company?.name || "Company"}</span>
      <h1 className="text-3xl mt-1 mb-4 font-display gradient-text inline-block">{job.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.location}</span>
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.jobType}</span>
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.position} openings</span>
        <span className="text-xs border border-accent text-accent px-2 py-1 rounded-sm">₹{job.salary} LPA</span>
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.experienceLevel} yrs exp</span>
      </div>

      <h2 className="text-lg mb-2 font-display border-l-2 border-accent pl-3">Description</h2>
      <p className="text-sm text-muted mb-6 whitespace-pre-line">{job.description}</p>

      {job.requirements && (
        <>
          <h2 className="text-lg mb-2 font-display border-l-2 border-accent pl-3">Requirements</h2>
          <p className="text-sm text-muted mb-6 whitespace-pre-line">{job.requirements}</p>
        </>
      )}

      {user?.role === "student" && (
        <button onClick={onApply} disabled={applying || applied} className="btn-primary">
          {applied ? "Applied" : applying ? "Applying..." : "Apply now"}
        </button>
      )}
      {message && <p className="text-sm mt-3 text-muted">{message}</p>}
    </div>
  );
}