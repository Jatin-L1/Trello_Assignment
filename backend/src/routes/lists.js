const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.post('/', listController.createList);
router.put('/:id', listController.updateList);
router.put('/:id/position', listController.updateListPosition);
router.delete('/:id', listController.deleteList);

module.exports = router;
