import multer from "multer"
import path from "path"
import fs from 'fs'
import express from 'express'
import { imageFileFilter } from "./uploadUserProfileImage"
import { v4 as uuidv4 } from 'uuid'

export const audioFileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

    const allowedMimeTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/flac'
    ]
    
    if (file.fieldname === 'song') {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo se permiten archivos de audio (MP3, WAV, FLAC)'))
        }
    } else if (file.fieldname === 'img') {
        imageFileFilter(req, file, cb)
    } else {
        cb(new Error('Archivo desconocido'))
    }
}

const songFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(process.cwd(), 'public', 'uploads', 'album', 'cover')
        if (file.fieldname === 'album') {
            uploadPath = path.join(process.cwd(), 'protected', 'album')
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req: express.Request, file, cb) => {
        const extension = path.extname(file.originalname)

        const fileName = `${uuidv4()}${extension}`
        let fullPath = path.join(process.cwd(), 'public', 'uploads', 'album', 'cover', fileName)
        if (file.fieldname === 'album') {
            fullPath = path.join(process.cwd(), 'protected', 'album', fileName)
        }

        cb(null, fileName)
    }
})

export const uploadAlbumFiles = multer({
    storage: songFilesStorage,
    fileFilter: audioFileFilter,
    limits: { fileSize: 40 * 1024 * 1024 }
}).fields([
    { name: 'img', maxCount: 1 },
    { name: 'album', maxCount: 1 }
])