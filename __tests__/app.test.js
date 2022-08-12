const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = request.agent(app);

jest.mock('../lib/services/github');

describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('GET /api/v1/posts lists all posts for authenticated user', async () => {
    await agent.get('/api/v1/github/callback?code=42');
    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          title: expect.any(String),
          post: expect.any(String),
        },
      ])
    );
  });

  afterAll(() => {
    pool.end();
  });
});
