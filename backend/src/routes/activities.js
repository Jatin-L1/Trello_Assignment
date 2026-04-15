const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/board/:board_id', activityController.getBoardActivities);
router.post('/', activityController.createActivity);

module.exports = router;
