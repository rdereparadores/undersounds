import multer from "multer"
import path from "path"
import fs from 'fs'
import express from 'express'
import { imageFileFilter } from "./uploadUserProfileImage"

const artistProfileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'profile')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req: express.Request, file, cb) => {
        const extension = path.extname(file.originalname)
        const fileName = `${req.uid!}${extension}`
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'profile', fileName)

        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath)
            } catch (_err) {
                cb(new Error('Error al eliminar el archivo existente'), fileName)
                return
            }
        }

        cb(null, fileName)
    }
})

export const uploadArtistProfileImage = multer({
    storage: artistProfileImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('artistProfileImg')