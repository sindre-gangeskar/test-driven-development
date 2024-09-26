const app = require('../app');
const request = require('supertest');

it('Register a new user', async () => {
  const response = await request(app).post('/users').send({
    firstname: 'Jest',
    lastname: 'Tester',
    username: 'jest101',
    password: 'asecret'
  })
  if (response.statusCode == 200) {
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('data.token');
  }
  if (response.stastusCode == 409) {
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  }
})