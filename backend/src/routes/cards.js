const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { upload } = require('../config/cloudinary');

router.get('/search', cardController.searchCards);
router.get('/:id', cardController.getCardById);
router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.put('/:id/position', cardController.updateCardPosition);
router.delete('/:id', cardController.deleteCard);

// File uploads
router.post('/:id/attachments', upload.single('file'), cardController.uploadAttachment);

module.exports = router;
