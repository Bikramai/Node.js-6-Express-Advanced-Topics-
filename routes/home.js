const express = require('express');
const router = express.Router();

// Template Engines
router.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello NODE.js' });
});

module.exports = router;