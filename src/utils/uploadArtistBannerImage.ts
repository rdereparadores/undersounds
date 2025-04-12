import multer from "multer"
import path from "path"
import fs from 'fs'
import express from 'express'
import { imageFileFilter } from "./uploadUserProfileImage"

const artistBannerImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'banner')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req: express.Request, file, cb) => {
        const extension = path.extname(file.originalname)
        const fileName = `${req.uid!}${extension}`
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'banner', fileName)

        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath)
            } catch {
                cb(new Error('Error al eliminar el archivo existente'), fileName)
                return   
            }
        }

        cb(null, fileName)
    }
})

export const uploadArtistBannerImage = multer({
    storage: artistBannerImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 15 * 1024 * 1024 }
}).single('artistBannerImg')