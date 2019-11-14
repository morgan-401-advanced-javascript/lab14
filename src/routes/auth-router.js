'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js')

/**
 * @route POST /signup
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required user password
 * @param {number} timeout how long before the user timesout
 * @returns {object} 200 - bearer token
 */
router.post('/signup', (req, res, next) => {

    res.status(200).json({token: 'Bearer ' + req.token});


});


/**
 * @route POST /signin
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required user password
 * @param {number} timeout how long before the user timesout
 * @returns {object} 200 - bearer token
 */
router.post('/signin', auth,  async (req, res, next) => {
    res.status(200).json({token: 'Bearer ' + req.token});

});

module.exports = router;
