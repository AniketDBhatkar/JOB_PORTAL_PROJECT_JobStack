import { Company } from "../models/company.model.js"

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company Name is required",
                success: false
            })
        }
        let company = await Company.findOne({ name: companyName })

        if (company) {
            return res.status(400).json({
                message: "you cant register same company",
                success: false

            })
        }

        // FIX: was previously spreading a stray `success: true` field into
        // the document being created — harmless (mongoose drops unknown
        // fields by default) but not intentional, removed.
        company = await Company.create({
            name: companyName,
        });

        return res.status(201).json({
            message: "Company register Sucessfully",
            company,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while registering the company.",
            success: false,
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const companies = await Company.find({});

        // FIX: Company.find() always resolves to an array (even an empty
        // one), never null/undefined, so this branch was effectively dead —
        // and it referenced an undefined variable `flase` (typo for false)
        // which would have thrown a ReferenceError if it were ever reached.
        // Kept as a defensive check with the typo fixed.
        if (!companies) {
            return res.status(404).json({
                message: "Companies not Found",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching companies.",
            success: false,
        });
    }
}

export const getCompanyById = async (req, res) => {
    try {

        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "company not found",
                success: false
            })
        }

        return res.status(200).json({
            company,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while fetching the company.",
            success: false,
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const updateData = { name, description, website, location };

        // FIX: req.file is now populated because multer is attached to this
        // route (see routers/company.router.js), and company.model.js's
        // `logo` field now stores a string path instead of a broken
        // ObjectId ref to "User".
        const file = req.file;
        if (file) {
            updateData.logo = `/uploads/${file.filename}`;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true })

        if (!company) {
            return res.status(400).json({
                message: "Company not found",
                success: false
            })
        }

        // FIX: previously didn't send the updated company back, so the
        // frontend had no way to reflect the change without a full refetch.
        return res.status(200).json({
            message: "Information Updated",
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while updating the company.",
            success: false,
        });
    }
}
