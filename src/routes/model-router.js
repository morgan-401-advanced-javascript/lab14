'use strict';

const express = require('express');
const router = express.Router();
const modelFinder = require('../middleware/model-finder.js');
const auth = require('../middleware/auth.js');
const preventAuthErrors = require('../middleware/prevent-auth-errors');

router.param('model', modelFinder.load);

/**
 * Prints details about a model
 * @route GET /model/:model
 * @group model data about specific model
 * @param {string} :model name of model in DB
 * @param {string} password.query.required
 * @returns {object} 200 an object with model name & count
 * @returns {Error} 500
 */
router.get('/model/:model', preventAuthErrors, auth, async (req, res, next) => {
  if(!req.model) next({status: 404, msg: 'cannot find requested mode'});
  let records = await req.model.getFromField({});
  let recordCount = records.length;

  let data = {
    model: req.params.model,
    count: recordCount,
  };
  if (req.user && req.user.role === 'admin') data.records = records;

  res.status(200).json(data);
});
/**
 * Prints details about a model
 * @route GET /model/:model/:id
 * @group model data about specific model
 * @param {string} :model.params.req name of model in DB
 * @param {string} :id.params.req if of record in DB
 * @param {string} password.query.required
 * @security bearerAuth
 * @returns {object} 200 the record
 * @returns {Error} 404 not found
 * @returns {Error} 403 forbidden access
 */
router.get('/model/:model/:id', auth, async (req, res, next) => {
  if (req.user.role === 'admin'){
    let record = await req.model.get(req.params.id);
    if(record && record._id)
      res.status(200).json(record);
    else
      next({status: 400, msg: 'unable to find records'});
  }
  else {
    next({status: 403, msg: 'forbidden to access this route'});
  }



});

module.exports = router;
