const app = require('../app');
const request = require('supertest');

it('User logged in', async () => {
  const response = await request(app).post('/users/login').send({
    username: 'jest101',
    password: 'asecret'
  })
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body).toHaveProperty('username');
}) 