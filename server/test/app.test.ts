import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /', () => {
  it('responds with server TEST', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('server TEST');
  });
});
