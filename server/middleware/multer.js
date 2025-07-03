const multer = require('multer');

const storage = multer.diskStorage({
  
  filename: function(req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
