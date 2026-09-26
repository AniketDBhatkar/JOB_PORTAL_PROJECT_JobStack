import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        };

        const decode = jwt.verify(token, process.env.SECRECT_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            })
        }

        req.id = decode.userId;
        next();
    }
    catch (error) {
        // A malformed/expired token throws inside jwt.verify — without this
        // catch responding, the request used to hang forever (next() was
        // never called and no response was sent).
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}

export default isAuthenticated;
