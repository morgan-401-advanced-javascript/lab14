'use strict';

const express = require('express');
const router = express.Router();
const modelFinder = require('../middleware/model-finder.js');

router.param('model', modelFinder.load);

router.get('/model/:model', (req, res, next) => {});

router.get('/model/:model/:id', (req, res, next) => {});

module.exports = router;
