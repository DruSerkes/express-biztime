process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
	// create and insert a test user
	const result = await db.query(
		`INSERT INTO companies (code, name, description) VALUES ('test', 'Test Company', 'A test company') RETURNING name, code, description`
	);
	testCompany = result.rows[0];
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
	test('get a list of companies', async () => {
		const response = await request(app).get('/companies');
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			companies : [ { code: testCompany.code, name: testCompany.name } ]
		});
	});
});

describe('GET /companies/:code', () => {
	test('get a single company', async () => {
		const response = await request(app).get(`/companies/${testCompany.code}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			company : {
				code        : testCompany.code,
				name        : testCompany.name,
				description : testCompany.description,
				invoices    : expect.any(Array)
			}
		});
	});
});

describe('POST /companies/', () => {
	test('Create a company', async () => {
		const response = await request(app)
			.post(`/companies/`)
			.send({ code: 'test2', name: 'test company 2', description: "Hey I'm testing here!" });
		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			company : {
				code        : 'test2',
				name        : 'test company 2',
				description : "Hey I'm testing here!"
			}
		});
	});
});

describe('PUT /companies/:code', () => {
	test('Update a company', async () => {
		const response = await request(app)
			.put(`/companies/${testCompany.code}`)
			.send({ name: 'TESTING HERE!', description: 'HEYYYY IM TESTING!!!' });
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			company : {
				code        : testCompany.code,
				name        : 'TESTING HERE!',
				description : 'HEYYYY IM TESTING!!!'
			}
		});
	});
});

describe('DELETE /companies/:code', () => {
	test('Delete a company', async () => {
		const response = await request(app).delete(`/companies/${testCompany.code}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			status : 'deleted'
		});
	});
});
