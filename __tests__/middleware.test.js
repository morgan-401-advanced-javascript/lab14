'use strict';

const { startDB, stopDB } = require('./supertester.js');
const Users = require('../src/models/users-model.js');
const Roles = require('../src/models/roles-model.js');
const Books = require('../src/models/books-model.js');
const server = require('../src/server.js').server;
const supertester = require('./supertester.js');
process.env.JWT_SECRET = 'secret';

const mockRequest = supertester.server(server);

let users = {
  admin: {
    username: 'sarah',
    password: 'sarahpassword',
    email: 'sarah@email.com',
    role: 'admin',
  },
  editor: {
    username: 'bill',
    password: 'billpassword',
    email: 'bill@email.com',
    role: 'editor',
  },
  user: {
    username: 'rene',
    password: 'renepassword',
    email: 'rene@email.com',
    role: 'user',
  },
};

let roles = {
  admin: {
    role: 'admin',
    capabilities: ['create', 'read', 'update', 'delete', 'superuser'],
  },
  editor: { role: 'editor', capabilities: ['create', 'read', 'update'] },
  user: { role: 'user', capabilities: ['read'] },
};

let books = {
  all: {
    title: 'Alice in Wonderland',
    auth: ['admin', 'editor', 'user'],
  },
  some: {
    title: 'Hamlet',
    auth: ['admin', 'editor'],
  },
  few: {
    title: 'Brave New World',
    auth: ['admin'],
  },
};

beforeAll(async done => {
  let usersDB = new Users();
  let rolesDB = new Roles();
  let booksDB = new Books();
  await startDB();
  await usersDB.create(users.admin);
  await usersDB.create(users.editor);
  await usersDB.create(users.user);
  await rolesDB.create(roles.admin);
  await rolesDB.create(roles.editor);
  await rolesDB.create(roles.user);
  await booksDB.create(books.all);
  await booksDB.create(books.some);
  await booksDB.create(books.few);
  done();
});

afterAll(stopDB);

describe('auth.js requires correct request headers', () => {
  it('throws error when request header is missing', async () => { 
   let response = await mockRequest
   .post('/signin')
   .set('Content-Type', 'application/json')
   .set('Accept', 'application/json');
   console.log(response.status);

   expect(response.body.error).toBe('missing request headers!');

  }); 
});


// describe('auth.js requires correct request headers', () => {
//   it('xxx', () => { }); 
// });
