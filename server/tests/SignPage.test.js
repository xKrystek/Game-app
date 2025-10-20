const request = require('supertest');
const { app, httpserver } = require('../src/main');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

afterAll(async () => {
  await mongoose.disconnect();
  httpserver.close();
});

// --- SERVER CHECK ---
describe('Server Health Check', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// --- REGISTER TESTS ---
describe('User Registration', () => {
  const userData = {
    name: 'test',
    email: 'test@test.com',
    password: '123456'
  };

  afterEach(async () => {
    await User.findOneAndDelete({ username: userData.name });
  });

  it('Successfully registers a user', async () => {
    const res = await request(app).post('/api/register').send(userData);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'User registered successfully',
      userData: {
        username: 'test',
        email: 'test@test.com'
      }
    });
  });

  it('Fails when email is missing', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ name: 'test', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('email')
    });
  });

  it('Fails when password is missing', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ name: 'test', email: 'test@test.com' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('password')
    });
  });

  it('Fails when password is too short', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ name: 'test', email: 'test@test.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('password')
    });
  });

  it('Fails when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ name: 'test', email: 'invalid-email', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('valid email')
    });
  });
});

// --- LOGIN TESTS ---
describe('User Login', () => {
  it('Logs in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'email@email.pl', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'User logged in successfully'
    });
  });

  it('Fails when email does not exist', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'unknown@email.com', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Wrong credentials'
    });
  });

  it('Fails when password is incorrect', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'email@email.pl', password: 'wrongpass' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Wrong credentials'
    });
  });

  it('Fails when email is invalid format', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'invalidemail', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: '"email" must be a valid email'
    });
  });

  it('Fails when email is empty', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: '', password: '123456' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('email')
    });
  });

  it('Fails when password is empty', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'email@email.pl', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('password')
    });
  });
});
