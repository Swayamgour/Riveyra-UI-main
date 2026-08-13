const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ✅ sanitize filename
const sanitizeFileName = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')              // space → dash
        .replace(/[()]/g, '')             // remove brackets
        .replace(/[^a-z0-9.-]/g, '');     // remove special chars
};

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {

        const isDocument =
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype.includes('document');

        // ✅ extension extract karo
        const ext = file.originalname.split('.').pop();

        // ✅ clean name
        const fileName = sanitizeFileName(
            file.originalname.replace(`.${ext}`, '')
        );

        return {
            folder: 'applications',
            resource_type: isDocument ? 'raw' : 'image',
            type: 'upload',

            // ✅ FINAL SAFE PUBLIC ID
            public_id: `applications/${Date.now()}-${fileName}.${ext}`,
        };
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;