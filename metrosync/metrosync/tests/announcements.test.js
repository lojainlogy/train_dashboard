const request = require('supertest');
const jwt = require('jsonwebtoken');
const createApp = require('../src/app');
const Station = require('../src/models/Station');
const Announcement = require('../src/models/Announcement');
const { connect, closeDatabase, clearDatabase } = require('./setup');

const app = createApp();

beforeAll(async () => connect());
afterEach(async () => clearDatabase());
afterAll(async () => closeDatabase());

describe('Announcements API', () => {
  it('POST /api/v1/announcements without a token returns 401', async () => {
    const station = await Station.create({ name: 'Test Station', line: 'Red', order: 1 });

    const res = await request(app)
      .post('/api/v1/announcements')
      .send({ text: 'Train delayed', station: station._id.toString() });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/announcements with a valid admin token creates an announcement', async () => {
    const station = await Station.create({ name: 'Test Station', line: 'Red', order: 1 });
    const token = jwt.sign({ id: 'admin-id', role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const res = await request(app)
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Train delayed', station: station._id.toString() });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBe('Train delayed');
  });

  it('GET announcements for a station returns them newest-first', async () => {
    const station = await Station.create({ name: 'Test Station', line: 'Red', order: 1 });
    await Announcement.create({ text: 'Older', station: station._id, timestamp: new Date('2026-01-01') });
    await Announcement.create({ text: 'Newer', station: station._id, timestamp: new Date('2026-02-01') });

    const res = await request(app).get(`/api/v1/announcements/station/${station._id}`);

    expect(res.status).toBe(200);
    expect(res.body.items[0].text).toBe('Newer');
    expect(res.body.items[1].text).toBe('Older');
  });
});
