import multer from 'multer';

const photoStorage = multer.memoryStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const photoUpload = multer({ storage: photoStorage });


const pdfStorage = multer.memoryStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const pdfUpload = multer({ storage: pdfStorage });

export { photoUpload,pdfUpload};