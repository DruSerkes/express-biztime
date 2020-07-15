process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
	// create and insert a test user
	const result = await db.query(
		`INSERT INTO companies (name, code) VALUES ('Test Company', 'test') RETURNING id, name, code`
	);
	testUser = result.rows[0];
});

afterEach(async () => {
	// delete any data created by test
	await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
	// close db connection otherwise connection will persist and tests won't finish
	await db.end();
});

describe('GET /companies', () => {
    test('get all companies', async () => {
        
    }
})