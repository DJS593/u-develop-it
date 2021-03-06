// why are we not useing inputCheck once we modularize?? //
const inputCheck = require('./utils/inputCheck');
const express = require('express');
const db = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');
/* originally in server.js, but moved to database.js as part of modularization */
//const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// by putting './api' we do not need to include it when we write the routes as part of modularization // 
// Use apiRoutes
app.use('/api', apiRoutes);

/* originally part of server.js, but moved to database.js as part of modularization */
// Connect to database
// const db = new sqlite3.Database('./db/election.db', err => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the election database.');
// });


/********************************/
/* leaving the original candidate code; it has been moved to candidateRoutes.js as part of modularization */


/* Get all candidates */
// app.get('/api/candidate', (req, res) => {
//   const sql = `SELECT candidates.*, parties.name 
//       AS party_name 
//       FROM candidates 
//       LEFT JOIN parties 
//       ON candidates.party_id = parties.id`;;
//   const params = [];
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// })




/* GET a single candidate */
// app.get('/api/candidate/:id', (req, res) => {
//   const sql = `SELECT candidates.*, parties.name 
//       AS party_name 
//       FROM candidates 
//       LEFT JOIN parties 
//       ON candidates.party_id = parties.id 
//       WHERE candidates.id = ?`;;
//   const params = [req.params.id];
//   db.get(sql, params, (err, row) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: row
//     });
//   });
// });




/* Delete a candidate */
// app.delete('/api/candidate/:id', (req, res) => {
//   const sql = `DELETE FROM candidates WHERE id = ?`;
//   const params = [req.params.id];
//   db.run(sql, params, function(err, result) {
//     if (err) {
//       res.status(400).json({ error: res.message });
//       return;
//     }

//     res.json({
//       message: 'successfully deleted',
//       changes: this.changes
//     });
//   });
// });


/* Create a candidate */
// app.post('/api/candidate', ({ body }, res) => {
//   const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
//   if (errors) {
//     res.status(400).json({ eror: errors });
//     return;
//   }

//   const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
//   const params = [body.first_name, body.last_name, body.industry_connected];
//   // ES5 function, not arrow function, to use 'this'
//   db.run(sql, params, function (err, result) {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: body,
//       id: this.lastID
//     });
//   });
// });


/* route to allow for candidate changes (example: party affiliation) */
// app.put('/api/candidate/:id', (req, res) => {
//   const sql = `UPDATE candidates SET party_id = ? 
//                WHERE id = ?`;
//   const params = [req.body.party_id, req.params.id];
//   const errors = inputCheck(req.body, 'party_id');

//   if (errors) {
//   res.status(400).json({ error: errors });
//   return;
// }
//   db.run(sql, params, function(err, result) {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: req.body,
//       changes: this.changes
//     });
//   });
// });

/*********************************/

/* original api/party code for reference; moved to partyRoutes.js to modularize the code */
/* route for 'parties' table */
// app.get('/api/party', (req, res) => {
//   const sql = `SELECT * FROM parties`;
//   const params = [];
  
  
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });


/* route for single party from 'parties' */
// app.get('/api/party/:id', (req, res) => {
//   const sql = `SELECT * FROM parties WHERE id = ?`;
//   const params = [req.params.id];
//   db.get(sql, params, (err, row) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: row
//     });
//   });
// });


/* delete route for 'parties' table */
// app.delete('/api/party/:id', (req, res) => {
//   const sql = `DELETE FROM parties WHERE id = ?`;
//   const params = [req.params.id];
//   db.run(sql, params, function(err, result) {
//     if (err) {
//       res.status(400).json({ error: res.message });
//       return;
//     }

//     res.json({
//       message: 'successfully deleted',
//       changes: this.changes
//     });
//   });
// });



// Default response for any other request(Not Found) Catch all
// needs to be last route
app.use((req, res) => {
  res.status(404).end();
});


// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});