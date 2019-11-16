'use strict';

const Users = require('../models/users-model.js');
const users = new Users();
const jwt = require('jsonwebtoken');

/**
 * 
 * @param {string} encoded base64 string
 * @returns {object} found user from the database
 */
const basicDecode = async encoded=>{
  let base64 = Buffer.from(encoded, 'base64'); // base64 buffer conversion of string
  let plainText = base64.toString(); // conversion from base64 buffer back to string
  let [username, password] = plainText.split(':'); // split string using delimiter : to get pieces
  let user = await users.getFromField({username});
  if (user.length){
    let isSamePassword = await user[0].comparePassword(password);
    if (isSamePassword) return user[0];
  } else {
    let newUser = await users.create({username: username, password: password});
    return newUser;
  }

};
const bearerDecrypt = async (token)=>{
  try{
    let tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenData && tokenData.data && tokenData.data.id)
      return await users.get(tokenData.data.id);


  } catch (e){
    console.error(e);
    return null;
  }
};

/**
 * This function takes in a request header auth & find a user
 * @param {} authorization required
 * @returns {object}  found user in req.user
 * @returns {string}  token for user in req.token
 */
module.exports = async (req, res, next) => {
  let authSplitString, authType, authData;
  if (!req.headers.authorization) 
    return req.authError === false
      ? next()
      : next({status: 400, msg: 'missing request headers!'});

  authSplitString = req.headers.authorization.split(/\s+/);
  if(authSplitString.length !== 2) next({status: 400, msg: 'incorrect format of reqest header'});

  authType = authSplitString[0];
  authData = authSplitString[1];

  let user;

  if (authType === 'Basic') user =  await basicDecode(authData);
  else if (authType === 'Bearer') user = await bearerDecrypt(authData);

  else next({status: 400, msg: 'Neither Basic nor Bearer Auth'});

  if(user){
    // eslint-disable-next-line require-atomic-updates
    req.user = user;
    // eslint-disable-next-line require-atomic-updates
    req.token = user.generateToken(req.headers.timeout);
    next();
  } else next({status: 401, msg: 'Unauthorized'});
};
