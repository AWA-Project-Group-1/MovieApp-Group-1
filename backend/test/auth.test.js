import { expect } from 'chai';
import fetch from 'node-fetch';
import { initializeTestDb, insertTestUser, getToken } from '../helpers/test.js';

const base_url = 'http://localhost:3001';

describe('POST /signup', () => {

    before(async () => {
        await initializeTestDb(); // Initialize test db
    });

    const email = 'signup@test.com'
    const password = 'signup123'

    it('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/api/auth/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        })
        const data = await response.json()

        expect(response.status).to.equal(201, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('userId')
    })

    it('should not register with already registered email', async () => {
        // Attempting to register with the same email (used in previous test case) again
        const response = await fetch(base_url + '/api/auth/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        })
        const data = await response.json()

        expect(response.status).to.equal(400)
        expect(data).to.be.an('object')
        expect(data.error).to.equal('Email already registered')
    })

    it("should not register without providing an email", async () => {
        const response = await fetch(base_url + "/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: "register123" }), // Email is missing
        });
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.error).to.equal("Email and password are required");
    });

    it('should not register without providing a password', async () => {
        const response = await fetch(base_url + '/api/auth/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email })  // Missing password
        })
        const data = await response.json()

        expect(response.status).to.equal(400)
        expect(data).to.be.an('object')
        expect(data.error).to.equal('Email and password are required')
    })
})

describe('POST /signin', () => {
    const email = 'signin@test.com';
    const password = 'signin123';

    // This assumes you have a helper function to insert a test user into the database
    before(async () => {
        await insertTestUser(email, password);
    });

    it('should sign in with valid credentials', async () => {
        const response = await fetch(base_url + '/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });

    it('should return 400 if email is not registered', async () => {
        const response = await fetch(base_url + '/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'notfound@foo.com', password }),
        });
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.error).to.equal('User not found');
    });

    it('should not sign in if password is incorrect', async () => {
        const response = await fetch(base_url + '/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: 'wrongpassword' }),
        });
        const data = await response.json();

        expect(response.status).to.equal(400);
        expect(data.error).to.equal('Invalid credentials');
    });
});


describe('DELETE /delete-account', () => {

    let userId;
    let token;

    before(async () => {

        const email = 'deleteuser@test.com';
        const password = 'deleteUser123';
        userId = await insertTestUser(email, password);
        token = getToken(email, userId);
    });

    it('should delete a user account', async () => {

        const response = await fetch(base_url + '/api/auth/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data.message).to.equal('Account deleted successfully');
    });

    it('should not delete the user account if token is invalid', async () => {

        const response = await fetch(base_url + '/api/auth/delete-account', {
            method: 'DELETE',
        });

        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data).to.be.an('object');
        expect(data.error).to.equal('Authorization token required');
    });

});

describe('POST /logout (mock)', () => {

    // Mock localStorage for Node.js environment
    global.localStorage = {
        storage: {},
        setItem(key, value) {
            this.storage[key] = value;
        },
        getItem(key) {
            return this.storage[key] || null;
        },
        removeItem(key) {
            delete this.storage[key];
        },
        clear() {
            this.storage = {};
        }
    };

    const email = 'logout@test.com';
    const password = 'logout1234';
    let userId = insertTestUser(email, password);
    let token = getToken(email, userId);

    // Simulate login by setting items in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("email", token.email);
    localStorage.setItem("id", token.userId);

    it('should simulate logout and clear session data in localStorage', () => {
        // Simulate logout functionality
        const logout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("id");
        };
        logout();

        expect(localStorage.getItem("token")).to.equal(null);
        expect(localStorage.getItem("email")).to.equal(null);
        expect(localStorage.getItem("id")).to.equal(null);
    });
});
