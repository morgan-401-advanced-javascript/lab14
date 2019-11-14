'use strict';
/**
 * this error middleware takes an error and sets the response status and sends any error data as the response body
 * @param {object} err error with keys status & msg
 * @returns {Error} status 400-500 
 * @returns {string} msg error message
 */
module.exports = (err, req, res, next) => {
    if (err.status)
    res.status
    else
    res.status(500);

    if(err.msg) res.json({error: err.msg})
    else res.json({error: 'Unknown error'});

console.log('errorr', err)

};
