import { expect } from 'chai';
import fetch from 'node-fetch';
import { initializeTestDb, insertTestUser, getToken } from '../helpers/test.js';

const base_url = 'http://localhost:3001';

before(async () => {
    await initializeTestDb(); // Initialize test db
});

//Integration test for browsing both movies' and Tv shows' reviews
describe('Integration Tests - Creating and Retrieving Reviews for Movies and TV Shows', () => {

    let userId;
    let token;

    before(async () => {
        const email = 'review@integrationtest.com';
        const password = 'review1234';
        userId = await insertTestUser(email, password);
        token = getToken(email, userId);
    })

    it('should add a review for a movie', async () => {
        const movieTestReview = {
            movieId: "2",
            rating: "5",
            comment: "Test review for movie!",
            type: "movie",
        };

        const response = await fetch(base_url + '/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(movieTestReview),
        });

        const data = await response.json();
        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys('id', 'movies_id', 'rating', 'comment', 'created_at', 'type');
        expect(data.type).to.equal('movie');
    });

    it('should add a review for a TV show', async () => {
        const tvSeriesTestReview = {
            movieId: "3",
            rating: "5",
            comment: "Test review for TV show!",
            type: "tv",
        };

        const response = await fetch(base_url + '/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(tvSeriesTestReview),
        });

        const data = await response.json();
        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys('id', 'movies_id', 'rating', 'comment', 'created_at', 'type');
        expect(data.type).to.equal('tv');
    });

    it('should get all reviews for a movie', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/2');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should get all reviews for a TV show', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/3');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should return an empty array when no reviews are available for a movie', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when no reviews are available for a TV show', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an error if the movieId is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/x');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid movieId.');
    });

    it('should return an error if the type is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/x/1');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid contentType. Expected "movie" or "tv".');
    });

});

// Unit tests to get reviews for movies and TV shows
describe('GET Reviews for Movies and TV Shows - Unit Tests', () => {

    it('should get all reviews for a movie', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/1');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should get all reviews for a TV show', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/1');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'movies_id', 'email', 'rating', 'comment', 'created_at', 'type');
    });

    it('should return an empty array when no reviews are available for a movie', async () => {
        const response = await fetch(base_url + '/api/reviews/movie/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when no reviews are available for a TV show', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/6');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should return an error if the movieId is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/tv/x');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid movieId.');
    });

    it('should return an error if the type is not valid', async () => {
        const response = await fetch(base_url + '/api/reviews/x/1');
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data).to.be.an('object').that.has.property('error', 'Missing or invalid contentType. Expected "movie" or "tv".');
    });

});
