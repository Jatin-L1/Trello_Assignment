const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const { upload } = require('../config/cloudinary');

router.get('/', boardController.getAllBoards);
router.get('/:id', boardController.getBoardById);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);
router.post('/:id/background', upload.single('file'), boardController.uploadBackground);

module.exports = router;
