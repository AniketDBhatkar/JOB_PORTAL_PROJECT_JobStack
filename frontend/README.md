# Hirely — Frontend (React + Tailwind)

Wired to your existing Express backend. No mock data — every page fetches from your real API.

## 1. Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL if your backend isn't on :3000
npm run dev
```

Runs on `http://localhost:5173`, matching the `cors` origin your `index.js` already allows.

Make sure your backend is running (`npm start` in the backend folder) and that `MONGO_URL` / `SECRECT_KEY` are set in its `.env`.

## 2. Backend fixes required (please apply these — the frontend can't work around them)

**1. `job.controller.js` → `getJobById` — currently crashes.**
```js
// current (broken):
const jobId = req.param.id;
...
return res.status.json({ job, success: true })

// fix:
const jobId = req.params.id;
...
return res.status(200).json({ job, success: true })
```
Until fixed, clicking into any job (`JobDescription.jsx`) will fail.

**2. `application.controller.js` → `applyJob` — applications are saved without an applicant.**
```js
// current (broken):
const newApplication = await Application.create({
  job: jobId,
  application: userId,   // <-- wrong field name
});

// fix:
const newApplication = await Application.create({
  job: jobId,
  applicant: userId,     // matches application.model.js
});
```
Until fixed, "already applied" checks never trigger and `AppliedJobs.jsx` will always show empty, because `Application.find({ applicant: userId })` never matches anything.

**3. (Optional, recommended) `user.controller.js` → `login` doesn't return `role`.**
The frontend currently works around this by trusting the role selected in the login form (already validated server-side), but returning `role` in the response object would make this cleaner and is needed if you build a mobile client later.

**4. (Optional) `job.controller.js` → `getadminJobs` returns *all* jobs, not just the logged-in recruiter's.**
It does `Job.find({})` instead of `Job.find({ created_by: adminId })`. Right now `AdminJobs.jsx` will show every job in the DB, not just the recruiter's own postings.

**5. (Optional) File uploads aren't wired yet.**
`updateProfile` (resume) and `updateCompany` (logo) reference `req.file`, but no `multer` middleware is attached in `user.router.js` / `company.router.js`. The frontend currently only sends text fields. Add multer (+ storage of your choice, e.g. Cloudinary) to those two routes if you want file upload support, and I can wire the frontend inputs for it.

## 3. Where each page talks to the backend

| Page | Endpoint(s) |
|---|---|
| `pages/Signup.jsx` | `POST /user/register` |
| `pages/Login.jsx` | `POST /user/login` |
| `components/Navbar.jsx` (logout) | `GET /user/logout` |
| `pages/Profile.jsx` | `POST /user/profile/update` |
| `pages/Home.jsx` | `GET /job/get?keyword=` |
| `pages/JobDescription.jsx` | `GET /job/get/:id`, `GET /application/apply/:id` |
| `pages/AppliedJobs.jsx` | `GET /application/get` |
| `pages/recruiter/Companies.jsx` | `GET /company/get` |
| `pages/recruiter/CompanyCreate.jsx` | `POST /company/register` |
| `pages/recruiter/CompanySetup.jsx` | `GET /company/get/:id`, `PUT /company/update/:id` |
| `pages/recruiter/AdminJobs.jsx` | `GET /job/getadminjobs` |
| `pages/recruiter/PostJob.jsx` | `POST /job/post`, `GET /company/get` |
| `pages/recruiter/Applicants.jsx` | `PUT /application/:id/applicants`, `PUT /application/status/:id/update` |

## 4. Auth notes

- Login sets an `httpOnly` cookie server-side; the frontend axios instance (`src/services/api.js`) uses `withCredentials: true` so it's sent automatically.
- There's no "who am I" endpoint on the backend, so `AuthContext.jsx` persists the logged-in user in `localStorage` after login purely for UI state (which nav links/routes to show). It is **not** what secures your API — `isAuthenticate.js` and the cookie still do that. If the cookie expires, API calls will start 401ing even though the frontend still thinks you're logged in — you may want to redirect to `/login` on a 401 (easy to add as an axios response interceptor in `services/api.js`).
- All job/company/application `GET` routes currently require `isAuthenticated`, so even browsing jobs requires being logged in. If you want public job browsing, remove `isAuthenticated` from `job.router.js`'s `/get` route.
