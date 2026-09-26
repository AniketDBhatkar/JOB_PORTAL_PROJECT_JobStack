
import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllJobs(q);
      setJobs(res.data?.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchJobs(keyword);
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <div
        className="mb-10 rounded-2xl px-6 py-12 sm:px-10 sm:py-16 shadow-lg"
        style={{
          background:
            "linear-gradient(193deg, rgba(63, 94, 251, 1) 32%, rgba(252, 70, 107, 1) 77%)",
        }}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            Find your next role
          </h1>

          <p className="text-white/85 text-sm sm:text-base mb-8">
            Search open positions across every company on Hirely.
          </p>

          <form
            onSubmit={onSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <input
              className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl
                         outline-none border-0 shadow-md
                         placeholder:text-gray-400
                         focus:ring-2 focus:ring-white/60"
              placeholder="Search by title or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-white text-[#3F5EFB] px-7 py-3 rounded-xl
                         font-semibold shadow-md
                         hover:bg-gray-100
                         transition-all duration-200
                         sm:w-auto w-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-sm mb-6">
          Loading jobs...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mb-6">
          {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            No jobs found. Try a different search.
          </p>
        </div>
      )}

      {/* Jobs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

    </div>
  );
}

