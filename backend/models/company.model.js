import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String, // stores the uploaded file's URL path (e.g. /uploads/xyz.png)
    }
}, { timestamps: true })

export const Company = mongoose.model("Company", companySchema);
