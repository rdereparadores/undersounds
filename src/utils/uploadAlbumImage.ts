import multer from "multer"
import path from "path"
import fs from 'fs'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const albumImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'album')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req: express.Request, file, cb) => {
        const extension = path.extname(file.originalname)
        const fileName = `${uuidv4()}${extension}`
        const fullPath = path.join(process.cwd(), 'public', 'uploads', 'artist', 'album', fileName)

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

export const imageFileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Formato inválido. Debe ser JPEG/PNG/JPG'))
    }
}

export const uploadAlbumImage = multer({
    storage: albumImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).fields([{ name: 'albumImage', maxCount: 1 }]);

