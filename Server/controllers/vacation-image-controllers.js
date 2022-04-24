const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const imagePath = `${__dirname}\\..\\assets\\images`;
const upload = multer({dest: imagePath});

router.post("/", upload.single("vacationImage"), (request, response) => {
      
    // Take the extension of the original file:
    const fileExtension = path.extname(request.file.originalname);

    // Take multer created path + file name: 
    const multerFileName = request.file.destination + "\\" + request.file.filename;

    // Create file name including extension: 
    const finalFileName = multerFileName + fileExtension;

    // Rename multer file name to contain the original extension: 
    fs.rename(multerFileName, finalFileName, err => {
        if (err) {
            response.status(500).json(err);
            return;
        }
        response.send(path.basename(finalFileName));
    });
});

module.exports = router;