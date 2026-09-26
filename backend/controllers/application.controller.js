import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js";


export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID requried",
                success: false,
            })
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            })
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            })
        };

        // FIX: was `application: userId` — that field doesn't exist on the
        // Application schema (it's `applicant`), so every application was
        // created with no applicant at all. This silently broke the
        // "already applied" check above and made every applied-jobs list
        // empty, since nothing ever matched `{ applicant: userId }`.
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job applied Successfully ",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while applying to the job.",
            success: false,
        });
    }
}

export const getApliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }
            }
        });

        if (!application) {
            return res.status(404).json({
                message: "not apllications",
                success: false,
            })
        };

        return res.status(200).json({
            application,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching applied jobs.",
            success: false,
        });
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "job not found ",
                success: false,
            })
        };

        // FIX: 202 (Accepted) implies async/pending processing, which isn't
        // the case here — this is a normal synchronous read, so 200 is
        // correct.
        return res.status(200).json({
            job,
            success: true,
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching applicants.",
            success: false,
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false,
            })
        }

        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Job not Found",
                success: false,
            })
        };

        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message: "Status Updated Successfully",
            success: true,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while updating status.",
            success: false,
        });
    }
}
