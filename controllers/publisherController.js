const Publisher = require('../models/Publisher');

exports.createPublisher = async (req, res) => {
    const newPublisher = new Publisher({
        publisher: req.body.publisher,
        domains: req.body.domains
    });
    try {
        const savedPublisher = await newPublisher.save();
        res.status(201).json(savedPublisher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addDomain = async (req, res) => {
    const { id } = req.params;
    const { domain, desktopAds, mobileAds } = req.body;

    try {
        const publisher = await Publisher.findById(id);
        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found' });
        }
        // Check if the domain name already exists in any publisher
        const existingDomain = await Publisher.findOne({
            'domains.domain': domain
        });

        if (existingDomain) {
            // If found, return an error message
            return res.status(400).json({
                message: `This domain is already configured on ${existingDomain.publisher}, try a different domain name.`
            });
        }
        // If no conflicts, add the new domain
        publisher.domains.push({ domain, desktopAds, mobileAds });
        await publisher.save();
        res.status(201).json(publisher);
    } catch (error) {
        console.error('Failed to add new domain:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.json(publishers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDomain = async (req, res) => {
    const { publisherId, domainId } = req.params;
    const { domain, desktopAds, mobileAds } = req.body;

    try {
        const currentPublisher = await Publisher.findById(publisherId);
        const domainToUpdate = currentPublisher.domains.id(domainId);
        if (!domainToUpdate) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        // Check if the updated domain name already exists in other publishers
        const existingDomain = await Publisher.findOne({
            _id: { $ne: publisherId },  // Exclude the current publisher
            'domains.domain': domain     // Look for a domain with the same name
        });

        if (existingDomain) {
            // If found, return an error message with the name of the publisher that already has this domain
            return res.status(400).json({
                message: `This domain is already configured on ${existingDomain.publisher}, try a different domain name.`
            });
        }

        // If no conflicts, update the domain
        domainToUpdate.set({ domain, desktopAds, mobileAds });
        await currentPublisher.save();
        res.status(200).json(currentPublisher);
    } catch (error) {
        console.error('Failed to edit domain:', error);
        res.status(400).json({ message: error.message });
    }
};
