const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

// GET /invoices
// Return info on invoices: like {invoices: [{id, comp_code}, ...]}

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT id, comp_code FROM invoices`);
		return res.json({ invoices: results.rows });
	} catch (e) {
		return next(e);
	}
});

// GET /invoices/[id]
// Returns obj on given invoice.

// If invoice cannot be found, returns 404.
// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [ id ]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Cannot find invoice with id ${id}`, 404);
		}
		const invoice = results.rows[0];
		const companyResults = await db.query(`SELECT * FROM companies WHERE code = $1`, [ invoice.comp_code ]);
		return res.json({ invoice: { invoice, company: companyResults.rows } });
	} catch (e) {
		return next(e);
	}
});

// POST /invoices
// Adds an invoice.

// Needs to be passed in JSON body of: {comp_code, amt}

// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.post('/', async (req, res, next) => {
	try {
		const { comp_code, amt } = req.body;
		if (!comp_code || !amt) {
			throw new ExpressError(`Cannot create invoice - please check that comp_code, amt are provided`, 400);
		}
		const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`, [
			comp_code,
			amt
		]);
		return res.status(201).json({ invoice: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

// PUT /invoices/[id]
// Updates an invoice.

// If invoice cannot be found, returns a 404.

// Needs to be passed in a JSON body of {amt}

// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.put('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const { amt } = req.body;
		if (!amt) throw new ExpressError('Please enter amount (amt)', 400);
		const results = await db.query(`UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *`, [ amt, id ]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Invoice not found`, 404);
		}
		return res.json({ invoice: results.rows[0] });
	} catch (e) {
		return next(e);
	}
});

// DELETE /invoices/[id]
// Deletes an invoice.

// If invoice cannot be found, returns a 404.

// Returns: {status: "deleted"}

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING *`, [ id ]);
		if (results.rows.length === 0) {
			throw new ExpressError(`Invoice not found`, 404);
		}
		return res.json({ status: 'deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
