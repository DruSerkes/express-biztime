process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;
let testCompany;
beforeEach(async () => {
	// create and insert a test user
	const companyResult = await db.query(
		`INSERT INTO companies (code, name, description) VALUES ('test', 'Test Company', 'A test company') RETURNING *`
	);
	testCompany = companyResult.rows[0];

	const invoiceResult = await db.query(
		`INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES ('test', 200, false, null) RETURNING *`
	);
	testInvoice = invoiceResult.rows[0];
	testInvoice.company = testCompany;
	console.log(`TEST INVOICE = `, testInvoice);
});

afterEach(async () => {
	// delete any data created by test
	await db.query(`DELETE FROM invoices`);
	await db.query(`DELETE FROM companies`);
});

afterAll(async () => {
	// close db connection otherwise connection will persist and tests won't finish
	await db.end();
});

describe('GET /invoices', () => {
	test('get a list of invoices', async () => {
		const response = await request(app).get('/invoices');
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			invoices : [ { id: testInvoice.id, comp_code: testInvoice.comp_code } ]
		});
	});
});

describe('GET /invoices/:code', () => {
	test('get a single invoice', async () => {
		const response = await request(app).get(`/invoices/${testInvoice.id}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			invoice : {
				id        : testInvoice.id,
				comp_code : testInvoice.comp_code,
				amt       : testInvoice.amt,
				paid      : testInvoice.paid,
				add_date  : expect.any(String),
				paid_date : testInvoice.paid_date,
				company   : {
					code        : testCompany.code,
					name        : testCompany.name,
					description : testCompany.description
				}
			}
		});
	});
});

describe('POST /invoices/', () => {
	test('Create a invoice', async () => {
		const response = await request(app).post(`/invoices/`).send({ comp_code: 'test', amt: 100 });
		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			invoice : {
				id        : expect.any(Number),
				comp_code : 'test',
				amt       : 100,
				paid      : false,
				add_date  : expect.any(String),
				paid_date : null
			}
		});
	});
});

describe('PUT /invoices/:code', () => {
	test('Update a invoice', async () => {
		const response = await request(app).put(`/invoices/${testInvoice.id}`).send({ amt: 555 });
		expect(response.statusCode).toBe(200);
		console.log(response.body);

		expect(response.body).toEqual({
			invoice : {
				id        : testInvoice.id,
				comp_code : testInvoice.comp_code,
				amt       : 555,
				paid      : testInvoice.paid,
				add_date  : expect.any(String),
				paid_date : testInvoice.paid_date
			}
		});
	});
});

describe('DELETE /invoices/:code', () => {
	test('Delete an invoice', async () => {
		const response = await request(app).delete(`/invoices/${testInvoice.id}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			status : 'deleted'
		});
	});
});
