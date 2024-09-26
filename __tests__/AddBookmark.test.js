const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
it('Add bookmark to logged in user', async () => {
  const loginResponse = await request(app).post('/users/login').send({
    username: 'jest101',
    password: 'asecret'
  })
  const token = loginResponse._body.token;

  const response = await request(app).post('/bookmarks').set('Authorization', `Bearer ${token}`).send({ Name: 'New Bookmark', URL: 'http://localhost:3000' })
  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('message', 'Bookmark created successfully');
})

it('Get bookmark based on user ID', async () => {
  const loginResponse = await request(app).post('/users/login').send({ username: 'jest101', password: 'asecret' });
  const token = loginResponse._body.token;
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const response = await request(app).get('/bookmarks/10').set(`Authorization`, `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message', 'Found bookmark');
  expect(response.body).toHaveProperty('bookmark.Name', 'New Bookmark')
})