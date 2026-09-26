import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies } from "../../services/companyService";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCompanies();
        setCompanies(res.data?.companies || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load companies.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Companies</h1>
        <Link to="/admin/companies/create" className="btn-primary">+ New company</Link>
      </div>

      {loading && <p className="text-muted text-sm">Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && companies.length === 0 && (
        <p className="text-muted text-sm">No companies yet. Register one to start posting jobs.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c) => (
          <Link key={c._id} to={`/admin/companies/${c._id}`} className="card p-5 hover:border-accent transition-colors">
            <h3 className="font-semibold mb-1">{c.name}</h3>
            <p className="text-xs text-muted line-clamp-2">{c.description || "No description yet."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
