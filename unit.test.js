const request = require('supertest');
const app = require('./index');
const mongoose = require('mongoose');

describe('Unit Tests', () => {

    let updateTestNoteId, deleteTestNoteId;
    const getRandomNoteId = async () => {
        const response = await request(app).get('/api/notes');
        const notes = response.body.notes;
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        return randomNote._id;
    };

    // Create a test note before running the tests
    beforeAll(async () => {
        updateTestNoteId = await getRandomNoteId();
        deleteTestNoteId = await getRandomNoteId();
    },20000);

    // Note creation test
    it('should create a new note', async () => {
        const response = await request(app)
            .post('/api/notes')
            .send({ title: 'Test Note', content: 'This is a test note.' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('note');
    }, 10000);

    // Getting all notes test
    it('should get all notes', async () => {
        const response = await request(app).get('/api/notes');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('notes');
    });

    // Updating a note test
    it('should get all notes', async () => {
        //Updating the note.
        const updatedData = { title: 'Updated Test Note', content: 'This is the updated content.' };
        const response = await request(app).put(`/api/notes/${updateTestNoteId}`).send(updatedData);
        expect(response.body).toHaveProperty('note');
    }, 10000); 

    // Deleting a note test
    it('should get all notes', async () => {
        const response = await request(app).delete(`/api/notes/${deleteTestNoteId}`);
        expect(response.body).toHaveProperty('result');
        expect(response.body.result).toBe(true);
    });

    afterAll(() => {
        mongoose.connection.close();
    });
});