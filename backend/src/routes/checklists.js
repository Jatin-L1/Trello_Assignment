const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');

router.post('/', checklistController.createChecklist);
router.put('/:id', checklistController.updateChecklist);
router.delete('/:id', checklistController.deleteChecklist);
router.post('/items', checklistController.createChecklistItem);
router.put('/items/:id', checklistController.updateChecklistItem);
router.delete('/items/:id', checklistController.deleteChecklistItem);

module.exports = router;
