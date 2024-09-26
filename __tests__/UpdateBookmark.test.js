const app = require('../app');
const request = require('supertest');

it('Update bookmark for logged in user', async () => {
  const loginResponse = await request(app).post('/users/login').send({ username: 'jest101', password: 'asecret' });
  expect(loginResponse.statusCode).toBe(200);
  expect(loginResponse.body).toHaveProperty('token');

  const token = loginResponse._body.token;

  const response = await request(app).put('/bookmarks').set('Authorization', `Bearer ${token}`).send({
    Name: 'jest category update test',
    id: 1
  })

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message', 'Successfully updated category');

})