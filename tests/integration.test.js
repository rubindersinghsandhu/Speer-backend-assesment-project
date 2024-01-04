// tests/integration.test.js
const request = require('supertest');
const app = require('../index'); // Adjust the path based on your project structure
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Integration and End-to-End Tests', () => {

  let authToken;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    authToken = response.body.token;
  }, 20000);

  it('should create, get, update, and delete a note', async () => {
    // Create a note
    const createResponse = await request(app)
      .post('/api/notes')
      .set('Authorization', authToken)
      .send({ title: 'Test Note', content: 'This is a test note' });

    expect(createResponse.status).toBe(201);
    const createdNoteId = createResponse.body.note._id;
    // Get the created note
    const getResponse = await request(app)
      .get(`/api/notes/${createdNoteId}`)
      .set('Authorization', authToken);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.note.title).toBe('Test Note');

    // Update the created note
    const updateResponse = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set('Authorization', authToken)
      .send({ title: 'Updated Note', content: 'This note has been updated' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.note.title).toBe('Updated Note');

    // Delete the created note
    const deleteResponse = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set('Authorization', authToken);

    expect(deleteResponse.body.result).toBe(true);
  }, 20000);

  afterAll(() => {
    mongoose.connection.close();
  });
});
