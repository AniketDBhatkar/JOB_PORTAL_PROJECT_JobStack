import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card p-5 flex flex-col gap-3 relative group transition-shadow hover:shadow-lg"
    >
      <div className="absolute inset-0 rounded-sm gradient-bg opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted">
          {job?.company?.name || "Company"}
        </span>
        <span className="text-xs text-muted">{job.location}</span>
      </div>

      <h3 className="text-lg font-semibold leading-snug group-hover:gradient-text transition-colors">
        {job.title}
      </h3>
      <p className="text-sm text-muted line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.jobType}</span>
        <span className="text-xs border border-line px-2 py-1 rounded-sm">{job.position} openings</span>
        <span className="text-xs border border-line px-2 py-1 rounded-sm">₹{job.salary} LPA</span>
      </div>
    </Link>
  );
}