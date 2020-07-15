const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// Routes Needed
// GET /companies
// Returns list of companies, like {companies: [{code, name}, ...]}

router.get('/', async (req, res, next) => {
	try {
        const results = await db.query(`SELECT * FROM `)
	} catch (e) {
		return next(e);
	}
});

// GET /companies/[code]
// Return obj of company: {company: {code, name, description}}

// If the company given cannot be found, this should return a 404 status response.

router.get('/:code', async (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

// POST /companies
// Adds a company.

// Needs to be given JSON like: {code, name, description}

// Returns obj of new company: {company: {code, name, description}}

router.post('/', async (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

// PUT /companies/[code]
// Edit existing company.

// Should return 404 if company cannot be found.

// Needs to be given JSON like: {name, description}

// Returns update company object: {company: {code, name, description}}

router.put('/:code', async (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

// DELETE /companies/[code]
// Deletes company.

// Should return 404 if company cannot be found.

// Returns {status: "deleted"}

router.delete('/:code', async (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});
