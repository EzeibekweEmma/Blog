import express, { Request, Response } from 'express';
import config from '@/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { fileSchema } from '@/utils/generalValidation';
import { ZodError } from 'zod';

const router = express.Router();

cloudinary.config(config.cloudinary);

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage });

router.post("/", upload.single('file'), async (req: Request, res: Response): Promise<any> => {
  try {
    const { path } = fileSchema.parse(req.file);

    cloudinary.uploader.upload(path, (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Media uploaded successfully", url: result?.secure_url });
    })

  } catch (err) {
    console.error("Error:", err);

    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
