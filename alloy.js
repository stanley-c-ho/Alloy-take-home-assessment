
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//enables you to set the PORT in cmd by typing "set PORT=[enter PORT]", otherwise it'll default to 4000
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


//using module.export from applicants.js 
let applicants = require('./applicants');


//http://localhost:4000/evaluations
//uses applicants.js
server.get("/evaluations", (req, res) => {
    res.json(applicants);
 });

 //http://localhost:4000/evaluations/[input SSN]
 //append SSN to GET specific evaluation
 server.get("/evaluations/:document_ssn", (req, res) => {
    const document_ssnId = req.params.document_ssn; //following "params." is what you're filtering on
    const evaluation = applicants.find(eval => eval.document_ssn === document_ssnId);
 
    if (evaluation) {
       res.json(evaluation);
    } else {
       res.status(404).send({ message: `No evaluation with SSN ${document_ssnId} exists`})
    }
 });


server.use(cors());

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.post('/evaluations', (req, res) => {

    if (!req.body.name_first) {
        // 400 bad request
        res.status(400).send('POST request failed: "name_first" is required');
        return;
    }
    if (!req.body.name_last) {
        // 400 bad request
        res.status(400).send('POST request failed: "name_last" is required');
        return;
    }
    if (!req.body.address_line_1) {
        // 400 bad request
        res.status(400).send('POST request failed: "address_line_1" is required');
        return;
    }
    if (!req.body.address_city) {
        // 400 bad request
        res.status(400).send('POST request failed: "address_city" is required');
        return;
    }
    if (!req.body.address_state) {
        // 400 bad request
        res.status(400).send('POST request failed: "address_state" is required');
        return;
    }
    if (req.body.address_state.length != 2) {
        // 400 bad request
        res.status(400).send('POST request failed: "address_state" must be a two-letter code');
        return;
    }
    if (!req.body.address_postal_code) {
        // 400 bad request
        res.status(400).send('POST request failed: "address_postal_code" is required');
        return;
    }
    if (!req.body.address_country_code || req.body.address_country_code != 'US') {
        // 400 bad request
        res.status(400).send('POST request failed: "address_country_code" is required and must have value "US"');
        return;
    }
    if (req.body.document_ssn.length != 9) {
        // 400 bad request
        res.status(400).send('POST request failed: "document_ssn" must be 9 digits, no dashes');
        return;
    }
    if (!req.body.email_address) {
        // 400 bad request
        res.status(400).send('POST request failed: "email_address" is required');
        return;
    }
// Deny and Review
    if (req.body.name_last === 'Deny') {
        // 400 bad request
        res.status(400).send('Sorry, your application was not successful');
        return;
    }
    if (req.body.name_last === 'Review') {
        // 400 bad request
        res.status(400).send('Thanks for submitting your application, we will be in touch shortly');
        return;
    }

    const evaluation = req.body;

    // output the book to the console for debugging
    console.log(evaluation);
    applicants.push(evaluation);

    res.send('We have successfully received your application');
});


//update an evaluation
 server.put("/evaluations/:document_ssn", (req, res) => {

    if (!req.body.name_first) {
        // 400 bad request
        res.status(400).send('Update failed: "name_first" is required');
        return;
    }
    if (!req.body.name_last) {
        // 400 bad request
        res.status(400).send('Update failed: "name_last" is required');
        return;
    }
    if (!req.body.address_line_1) {
        // 400 bad request
        res.status(400).send('Update failed: "address_line_1" is required');
        return;
    }
    if (!req.body.address_city) {
        // 400 bad request
        res.status(400).send('Update failed: "address_city" is required');
        return;
    }
    if (!req.body.address_state) {
        // 400 bad request
        res.status(400).send('Update failed: "address_state" is required');
        return;
    }
    if (req.body.address_state.length != 2) {
        // 400 bad request
        res.status(400).send('Update failed: "address_state" must be a two-letter code');
        return;
    }
    if (!req.body.address_postal_code) {
        // 400 bad request
        res.status(400).send('Update failed: "address_postal_code" is required');
        return;
    }
    if (!req.body.address_country_code || req.body.address_country_code != 'US') {
        // 400 bad request
        res.status(400).send('Update failed: "address_country_code" is required and must have value "US"');
        return;
    }
    if (req.body.document_ssn.length != 9) {
        // 400 bad request
        res.status(400).send('Update failed: "document_ssn" must be 9 digits, no dashes');
        return;
    }
    if (!req.body.document_ssn) {
        // 400 bad request
        res.status(400).send('Update failed: "document_ssn" is required to update your application details.');
        return;
    }
    if (!req.body.email_address) {
        // 400 bad request
        res.status(400).send('Update failed: "email_address" is required');
        return;
    }
// Deny and Review
    if (req.body.name_last === 'Deny') {
        // 400 bad request
        res.status(400).send('Sorry, your application was not successful');
        return;
    }
    if (req.body.name_last === 'Review') {
        // 400 bad request
        res.status(400).send('Thanks for submitting your application, we will be in touch shortly');
        return;
    }

    const document_ssnId = req.params.document_ssn;
    const evaluation = req.body;
    console.log("Editing evaluation: ", document_ssnId, " to be ", evaluation);
 
    const updatedListEvaluations = [];
    // loop through list to find and replace one evaluation
    applicants.forEach(oldEvaluation => {
       if (oldEvaluation.document_ssn === document_ssnId) {
          updatedListEvaluations.push(evaluation);
       } else {
          updatedListEvaluations.push(oldEvaluation);
       }
    });
 
    // replace old list with new one
    applicants = updatedListEvaluations;
 
    //res.json(evaluation);
    res.send('We have successfully updated your application')
 });


// delete evaluation from list
server.delete("/evaluations/:document_ssn", (req, res) => {
    const document_ssnId = req.params.document_ssn;
 
    console.log("Delete evaluation with document_ssn: ", document_ssnId);
 
    // filter list copy, by excluding evaluation to delete
    const filtered_list = applicants.filter(evaluation => evaluation.document_ssn !== document_ssnId);
 
    // replace old list with new one
    applicants = filtered_list;
 
    res.json(applicants);
 });