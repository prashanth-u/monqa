const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

const { accessKeyId, secretAccessKey, bucketName } = require('../config/aws');
const { MAX_FILE_SIZE } = require('../config/constants');

AWS.config.update({ accessKeyId, secretAccessKey });
var s3 = new AWS.S3();

// todo: add file size limit
const upload = multer({
    dest: '/tmp/'
});

function generateId() {
    const idLength = 20;

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var len = characters.length;

    for (var i = 0; i < idLength; i++) {
        result += characters[Math.floor(Math.random()*len)]
    }

    return result;
}

module.exports = app => {
    app.post('/api/uploadFile', upload.single("files[0]"), async (req, res) => {

        if (req.file.size > MAX_FILE_SIZE) {
            const response = {
                error: `File is too large (Limit is ${MAX_FILE_SIZE/1000000}MB)`
            };
            return res.send(response);
        }

        // todo: make sure same filename doesn't exist already in bucket
        // todo: fix text files getting renamed

        const filePath = req.file.path,
            params = {
                Bucket: bucketName,
                Body: fs.createReadStream(filePath),
                Key: req.file.originalname
            };

        s3.upload(params, function(err, data) {
            fs.unlink(filePath, function(err2) {
                if (err2) return res.send({ error: err2.message });
            });

            if (err) return res.send({ error: err2.message });

            const response = { 
                link: data.Location,
                type: req.file.mimetype,
                name: req.file.originalname
            };
            res.send(response);
        });
    });
};