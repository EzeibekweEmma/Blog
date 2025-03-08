import express, { Request, Response } from 'express';
import config from '@/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { fileSchema } from '@/utils/generalValidation';
import { ZodError } from 'zod';
import Authentication from '@/middleware';

const router = express.Router();

cloudinary.config(config.cloudinary);

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage });

router.post("/", Authentication, upload.single('file'), async (req: Request, res: Response): Promise<any> => {
  try {
    const { path, mimetype } = fileSchema.parse(req.file);

    cloudinary.uploader.upload(path, { resource_type: "auto", folder: "empire-report/" }, (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const url = mimetype.startsWith('video') ? result?.secure_url :
        cloudinary.url(result?.public_id!, {
          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto'
            }
          ]
        })
      return res.status(200).json({ message: "Media uploaded successfully", url });
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
