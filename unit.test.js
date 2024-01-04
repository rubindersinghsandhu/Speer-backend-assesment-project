const request = require('supertest');
const app = require('./index');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Unit Tests', () => {

    let testNoteId, authToken;
    const authenticatedUser = {
        userId: 'testUserId',
    };

    const generateToken = (userId) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    };

    const getRandomNoteId = async () => {
        const response = await request(app).get('/api/notes').set('Authorization',  authToken);
        console.log(response);
        const notes = response.body.notes;
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        return randomNote._id;
    };

    // Create a test note before running the tests
    beforeAll(async () => {
        authToken = generateToken()
        testNoteId = await getRandomNoteId();

    }, 20000);

    // Test user registration
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({ username: 'testuser', password: 'testpassword' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
    });

    // Test user login
    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpassword' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    // Note creation test
    it('should create a new note', async () => {
        const response = await request(app)
            .post('/api/notes')
            .set('Authorization',  authToken)
            .send({ title: 'Test Note', content: 'This is a test note.' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('note');
    }, 10000);

    // Getting all notes test
    it('should get all notes', async () => {
        const response = await request(app).get('/api/notes').set('Authorization',  authToken);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('notes');
    });

    // Getting note by id test
    it('should get a note by id', async () => {
        const response = await request(app).get(`/api/notes/${testNoteId}`).set('Authorization',  authToken);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('note');
    });

    // Updating a note test
    it('should update a note', async () => {
        //Updating the note.
        const updatedData = { title: 'Updated Test Note', content: 'This is the updated content.' };
        const response = await request(app).put(`/api/notes/${testNoteId}`).send(updatedData).set('Authorization',  authToken);
        expect(response.body).toHaveProperty('note');
    }, 10000);

    // Deleting a note test
    it('should delete a note', async () => {
        const response = await request(app).delete(`/api/notes/${testNoteId}`).set('Authorization',  authToken);
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toBe(true);
    });

    // Search functionality test
    it('should search for notes', async () => {
        const response = await request(app).get('/api/search?q=test').set('Authorization',  authToken);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('results');
    });

    afterAll(() => {
        mongoose.connection.close();
    });
});