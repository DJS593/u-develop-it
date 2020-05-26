const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');


// Get all candidates
// originally app.get('/api/candidate')
router.get('/candidate', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
      AS party_name 
      FROM candidates 
      LEFT JOIN parties 
      ON candidates.party_id = parties.id`;;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    });
  });
})




// GET a single candidate
// originally app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
      AS party_name 
      FROM candidates 
      LEFT JOIN parties 
      ON candidates.party_id = parties.id 
      WHERE candidates.id = ?`;;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
});




// Delete a candidate
// originally app.delete('/api/candidate/:id')
router.delete('/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
});


/* Create a candidate */
// originally app.post('/api/candidate')
router.post('/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ eror: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // ES5 function, not arrow function, to use 'this'
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: body,
      id: this.lastID
    });
  });
});


// route to allow for candidate changes (example: party affiliation)
// originally app.put('/api/candidate/:id')
router.put('/candidate/:id', (req, res) => {
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
  res.status(400).json({ error: errors });
  return;
}
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: req.body,
      changes: this.changes
    });
  });
});


module.exports = router;