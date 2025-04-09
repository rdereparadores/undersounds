import multer from "multer"
import path from "path"
import fs from 'fs'
import express from 'express'

const userProfileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'user', 'profile')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req: express.Request, file, cb) => {
        const extension = path.extname(file.originalname)
        const fileName = `${req.uid!}${extension}`
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'user', 'profile', fileName)

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

const imageFileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid format. Must be JPEG/PNG/JPG.'))
    }
}

export const uploadUserProfileImage = multer({
    storage: userProfileImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('profileImage')

