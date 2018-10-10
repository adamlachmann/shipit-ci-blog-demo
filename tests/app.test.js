const request = require('supertest')
const app = require('../src/app')

describe('Test root path of the app', () => {
  test('It should respond 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
})