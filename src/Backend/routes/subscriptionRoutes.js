const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptionController');

router.post('/subscribe', controller.subscribe);
router.get('/subscriptions', controller.getAll);

module.exports = router;
