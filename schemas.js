const Joi = require('joi');

// Constraint: accepts names only as letters & converts to uppercase
const name = Joi.string().regex(/^[A-Z]+$/).uppercase();

// Constraint: accepts a valid UUID v4 string as id
const personID = Joi.string().guid({version: 'uuidv4'});

// ageSchema: accepts ages > 6
// value could be in one of these forms: 15, '15'. '15y', '15yr', '15yrs'
// all string ages will be replaced to strip off non-digits
const ageSchema = Joi.alternatives().try([
    Joi.number().integer().greater(6).required(),
    Joi.string().replace(/^([7-9][1-9]\d+)(y|yr|yrs)?$/i, '$1').required()
]);