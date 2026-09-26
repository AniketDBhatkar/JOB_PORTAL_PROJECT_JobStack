import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// Field name is "file" — used for both resume uploads and company logo
// uploads. If the request isn't multipart/form-data (e.g. a plain JSON
// request), multer simply does nothing and calls next(), so this is safe
// to attach even on requests that don't include a file.
export const singleUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("file");
