const request = require('supertest');
const createApp = require('../src/app');
const Station = require('../src/models/Station');
const { connect, closeDatabase, clearDatabase } = require('./setup');

const app = createApp();

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

describe('GET /api/v1/stations', () => {
  it('returns 200 with all seeded stations sorted by line then order', async () => {
    await Station.insertMany([
      { name: 'B Station', line: 'Blue', order: 2 },
      { name: 'A Station', line: 'Blue', order: 1 },
      { name: 'Red Second', line: 'Red', order: 2 },
      { name: 'Red First', line: 'Red', order: 1 },
    ]);

    const res = await request(app).get('/api/v1/stations');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(4);

    const lines = res.body.data.map((s) => `${s.line}:${s.order}`);
    expect(lines).toEqual(['Blue:1', 'Blue:2', 'Red:1', 'Red:2']);
  });
});
