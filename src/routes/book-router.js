'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const Books = require('../models/books-model.js');
const books = new Books();

router.get('/books', async (req, res, next) => {
    let allBooks = await books.getFromField({});
    let filteredBooks = [];

    allBooks.forEach(book => {
        if(book.auth.includes(req.user.role)) filteredBooks.push(book);
    })
    if (filteredBooks.length) res.status(200).json(filteredBooks);
    else next({status: 403, msg: 'you cannot see books'});
});

router.post('/books', auth, async (req, res, next) => {
    if(req.user.can('create')){
        try {
            await  books.create(req.body);
            return 'success!';
        }
        catch(e){
            next({status: 400, msg: e.name})
        }
    }
    else{
        next({status: 403, msg: 'you cannot create books'})
    }
});

router.put('/books/:id', auth, async (req, res, next) => {
    let book = await books.get.get(req.params.id);
    if (book && book._id){
        let newBookData = {
            ...{ 
            title: null,
            author: null,
            auth: []},
            ...req.body,
        }
        try{
            await books.update(req.params.id, newBookData);

        } catch(e){
            console.error(e);
            next({status: 400, msg: 'unable to update'})
        }

    } else {
        next({status: 404, msg: 'cannot find this book'})
    }
});
router.patch('/books/:id', async (req, res, next) => {
    if (req.user.can('update') !== true)
    return next({status: 403, msg: 'you cannot update books'})
    let book = await books.get(req.params.id);
    if (book && book._id){
        let newBookData = {
            ...{
                title: book.title,
                author: book.author,
                auth: book.auth,
            },
            ...req.body,
        };
        try{
            await books.update(req.params.id, newBookData);
            res.status(200).json('Successfully update book');
        } catch (e){
            console.error(e);
            next({status: 400, msg: 'unable to update'})

        }
    }

});

module.exports = router;
