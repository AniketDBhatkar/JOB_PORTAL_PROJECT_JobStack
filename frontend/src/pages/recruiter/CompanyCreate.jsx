import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCompany } from "../../services/companyService";

export default function CompanyCreate() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerCompany(companyName);
      if (res.data?.success) {
        navigate(`/admin/companies/${res.data.company._id}`);
      } else {
        setError(res.data?.message || "Could not register company");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-3xl mb-1">Register a company</h1>
      <p className="text-muted text-sm mb-8">You can add more details after this step.</p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Company name</label>
          <input className="input-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Creating..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
