const mongoose = require('mongoose');
const DomainSchema = new mongoose.Schema({
    domain: String,
    desktopAds: Number,
    mobileAds: Number
});

const PublisherSchema = new mongoose.Schema({
    publisher: String,
    domains: [DomainSchema]
});

const Publisher = mongoose.model('Publisher', PublisherSchema);
module.exports = Publisher;
