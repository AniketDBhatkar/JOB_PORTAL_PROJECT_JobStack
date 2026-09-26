# Hirely — Backend (corrected)

Same structure and endpoints as your original backend — every route, field name, and response shape the frontend already expects is unchanged. Only bugs were fixed.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URL and a real SECRECT_KEY
npm start
```

Runs on `http://localhost:3000` by default, matching the frontend's `VITE_API_BASE_URL`.

## What was fixed

**Crashes / broken logic**
1. `job.controller.js` → `getJobById`: `req.param.id` → `req.params.id`, and `res.status.json(...)` → `res.status(200).json(...)`. This route 500'd on every request before.
2. `application.controller.js` → `applyJob`: `Application.create({ job, application: userId })` → `{ job, applicant: userId }`. The field didn't exist on the schema, so applications were saved with no applicant — breaking the "already applied" check and making `getApliedJobs` always return an empty list.
3. `middleware/isAuthenticate.js`: an invalid/expired token thrown by `jwt.verify` was caught but never sent a response, so the request just hung. Now returns `401`.
4. `user.controller.js` / all controllers: several catch blocks only did `console.log(error)` with no response sent, which would also hang the frontend's fetch forever on any server error. All catch blocks now return a proper JSON error response.

**Data correctness**
5. `user.controller.js` → `login`: the returned `user` object didn't include `role`, even though it had just been validated. Now included.
6. `job.controller.js` → `getadminJobs`: was `Job.find({})` (returned *every* job to *every* recruiter). Now `Job.find({ created_by: adminId })`.
7. `company.controller.js` → `getCompany`: fixed a typo (`sucess:flase`, an undefined variable) that would have thrown if that branch were ever reached.
8. `company.controller.js` → `registerCompany`: removed a stray `success: true` field that was being passed into `Company.create(...)`.
9. `company.model.js` → `logo` field was typed as `mongoose.Schema.ObjectId, ref: "User"`, which can't hold an uploaded file. Changed to `String` (stores the uploaded file's URL path).

**File uploads now actually work**
10. `user.router.js` / `company.router.js` referenced `req.file` in their controllers (resume, logo) but had no file-upload middleware attached, so `req.file` was always `undefined`. Added `middleware/multer.js` (disk storage, 5MB limit) and wired it into both routes. `index.js` now also serves the `/uploads` folder statically so saved files are reachable by URL.
11. Skills string from the profile form is now trimmed per-entry (`"React, Node"` → `["React", "Node"]` instead of `["React", " Node"]`).

**Not changed on purpose**
- `application.router.js` still uses `GET /apply/:id` and `PUT /:id/applicants` — unusual verbs for those actions, but the frontend already calls them exactly this way. Left as-is to avoid breaking the frontend; happy to make both RESTful together if you want.
- `role: "recuriter"` (the typo) is kept everywhere, since it's used consistently across both frontend and backend — renaming it would require a matching change on both sides for zero functional benefit.

**Housekeeping**
- `package.json`: pinned `express` to `^4.21.2` and `mongoose` to `^8.9.5` (the original `^5.2.1` / `^9.9.1` don't correspond to versions either of those packages has released), and added `multer`.
- Removed the step-by-step `console.log` debugging lines from `register` — kept the error-path log, dropped the noisy success-path ones.

## Endpoints (unchanged, for reference)

| Method | Path | Auth |
|---|---|---|
| POST | /api/v1/user/register | – |
| POST | /api/v1/user/login | – |
| GET | /api/v1/user/logout | – |
| POST | /api/v1/user/profile/update | ✓ |
| POST | /api/v1/company/register | ✓ |
| GET | /api/v1/company/get | ✓ |
| GET | /api/v1/company/get/:id | ✓ |
| PUT | /api/v1/company/update/:id | ✓ |
| POST | /api/v1/job/post | ✓ |
| GET | /api/v1/job/get?keyword= | ✓ |
| GET | /api/v1/job/getadminjobs | ✓ |
| GET | /api/v1/job/get/:id | ✓ |
| GET | /api/v1/application/apply/:id | ✓ |
| GET | /api/v1/application/get | ✓ |
| PUT | /api/v1/application/:id/applicants | ✓ |
| PUT | /api/v1/application/status/:id/update | ✓ |
