// routes for uploading, config, validation for multer
import express from 'express'
import multer from 'multer'
const router = express.Router()
import path from 'path'

// config
// initialize storage engine
const storage = multer.diskStorage({
    // cb- callback, is a function that takes error and the destination where the file will be stored
    destination(req, file, cb) {
        cb(null, '/uploads')
    },
    // name the file
    filename(req, file, cb) {
        // path extracts the original extension name of the file
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// check if file has extension of jpg, jpeg, png
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('image'), (req, res) => {
    res.send(`${req.file.path}`)
})

export default router