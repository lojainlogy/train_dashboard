const request = require('supertest');
const createApp = require('../src/app');
const Admin = require('../src/models/Admin');
const { connect, closeDatabase, clearDatabase } = require('./setup');

const app = createApp();

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

describe('POST /api/v1/auth/login', () => {
  const email = 'admin@metrosync.local';
  const password = 'SuperSecret123';

  beforeEach(async () => {
    const passwordHash = await Admin.hashPassword(password);
    await Admin.create({ email, passwordHash, role: 'admin' });
  });

  it('returns a token for valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.admin.email).toBe(email);
  });

  it('rejects invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects malformed input before hitting the database', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
