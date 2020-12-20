const ItemController = require('../controllers/item');

const express = require('express');
const router = express.Router();

const path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, path.join(__dirname, '../public'));
    },
    filename(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png'];

    if(imageTypes.indexOf(file.mimetype) !== -1) {
        cb(null, true);
    }
    else{
        cb(new multer.MulterError('ERROR_FORMAT'));
    }
};

const uploadImage = multer({
    storage,
    fileFilter,
    limits: {fileSize: 20 * 1024 * 1024}
}).single('image');

const passport = require('passport');

router.post(
    '/',
    passport.authenticate('jwt', {session: false}, null),
    ItemController.create
);
router.get('/', ItemController.getList);
router.get('/:id', ItemController.getById);
router.put(
    '/:id',
    passport.authenticate('jwt', {session: false}, null),
    ItemController.verifyAccess,
    ItemController.update
);
router.delete(
    '/:id',
    passport.authenticate('jwt', {session: false}, null),
    ItemController.verifyAccess,
    ItemController.delete
);
router.post(
    '/:id/images',
    passport.authenticate('jwt', {session: false}, null),
    ItemController.verifyAccess,
    uploadImage,
    ItemController.saveImage,
    ItemController.handleErrorUploadItemImage
);

module.exports = router
