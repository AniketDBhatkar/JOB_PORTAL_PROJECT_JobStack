import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobDescription from "./pages/JobDescription";
import Profile from "./pages/Profile";
import AppliedJobs from "./pages/AppliedJobs";

import Companies from "./pages/recruiter/Companies";
import CompanyCreate from "./pages/recruiter/CompanyCreate";
import CompanySetup from "./pages/recruiter/CompanySetup";
import AdminJobs from "./pages/recruiter/AdminJobs";
import PostJob from "./pages/recruiter/PostJob";
import Applicants from "./pages/recruiter/Applicants";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDescription />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <ProtectedRoute role="student">
                <AppliedJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute role="recuriter">
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies/create"
            element={
              <ProtectedRoute role="recuriter">
                <CompanyCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies/:id"
            element={
              <ProtectedRoute role="recuriter">
                <CompanySetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute role="recuriter">
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs/post"
            element={
              <ProtectedRoute role="recuriter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs/:id/applicants"
            element={
              <ProtectedRoute role="recuriter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="text-center py-24 text-muted">Page not found.</div>} />
        </Routes>
      </main>
    </>
  );
}
