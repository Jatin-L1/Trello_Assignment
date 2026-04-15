const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/users', memberController.getAllUsers);
router.post('/card', memberController.addMemberToCard);
router.delete('/card/:card_id/:user_id', memberController.removeMemberFromCard);

module.exports = router;
