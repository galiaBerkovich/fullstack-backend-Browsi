const express = require('express');
const router = express.Router();
const PublisherController = require('../controllers/publisherController');


router.post('/', PublisherController.createPublisher);
router.post('/:id/domains', PublisherController.addDomain);
router.get('/', PublisherController.getAllPublishers);
router.put('/:publisherId/domains/:domainId', PublisherController.updateDomain);

module.exports = router;
