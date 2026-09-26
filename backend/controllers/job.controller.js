import { Job } from "../models/job.model.js"


export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "something is missing",
                success: false,
            });
        }

        const userId = req.id;

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "new job created successfully",
            job,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while posting the job.",
            success: false,
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                {
                    title: { $regex: keyword, $options: "i" }
                },
                {
                    description: { $regex: keyword, $options: "i" }
                }
            ]
        };

        const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Job not Found",
                success: false
            })
        }

        return res.status(200).json({
            jobs,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching jobs.",
            success: false,
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        // FIX: was `req.param.id` (no "s") which is always undefined, so
        // Job.findById(undefined) never matched anything.
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: "company" });
        if (!job) {
            return res.status(400).json({
                message: "Job not Found",
                success: false,
            })
        };

        // FIX: was `res.status.json(...)` — missing the `(200)` call, so
        // `res.status` (a function) doesn't have a `.json` method and this
        // threw a TypeError, 500-ing every single request to this route.
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while fetching the job.",
            success: false,
        });
    }
}

export const getadminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        // FIX: was `Job.find({})`, returning every job in the database for
        // every recruiter regardless of who posted it. Now scoped to the
        // logged-in recruiter's own postings.
        const jobs = await Job.find({ created_by: adminId }).populate({ path: "company" }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "job not found",
                success: false,
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching your jobs.",
            success: false,
        });
    }
}
