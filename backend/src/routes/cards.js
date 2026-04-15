const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/search', cardController.searchCards);
router.get('/:id', cardController.getCardById);
router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.put('/:id/position', cardController.updateCardPosition);
router.delete('/:id', cardController.deleteCard);

module.exports = router;
