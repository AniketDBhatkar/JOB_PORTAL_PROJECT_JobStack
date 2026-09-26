import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = async (req, res) => {

    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        };

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashPassword,
            role,
        });

        return res.status(201).json({
            message: "Account create Sucessfully",
            success: true,
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);
        // FIX: previously nothing was sent back here, so a server error left
        // the frontend's fetch hanging with no response at all.
        return res.status(500).json({
            message: "Something went wrong while registering.",
            success: false,
        });
    }
}

export const login = async (req, res) => {
    try {

        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        };

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or Password",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        };

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exit with current role",
                success: false,
            })
        };

        const tokenData = {
            userId: user._id
        }

        const token = jwt.sign(tokenData, process.env.SECRECT_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            // FIX: role was previously left out of the response object even
            // though it had just been validated — the frontend had no way
            // to know which dashboard/nav to show without it.
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" }).json({
            message: `welcome back ${user.fullName}`,
            user,
            success: true,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something went wrong while logging in.",
            success: false,
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0
        }).json({
            message: "Logout Sucessfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while logging out.",
            success: false,
        });
    }
}

export const updateProfile = async (req, res) => {

    try {

        const { fullName, email, phoneNumber, bio, skills } = req.body;
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map((s) => s.trim());
        }
        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            })
        }

        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // FIX: req.file is now actually populated because the multer
        // middleware is attached to this route (see routers/user.router.js).
        const file = req.file;
        if (file) {
            user.profile.resume = `/uploads/${file.filename}`;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({
            message: "Profile Updated Sucessfully",
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while updating profile.",
            success: false,
        });
    }
}
