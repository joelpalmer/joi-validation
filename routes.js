const express = require("express");
const router = express.Router();
const SchemaValidator = require('./middlewares/SchemaValidator');

// we are using the formated Joi Validation error
// Pass false as argument to use generic error
const validateRequest = SchemaValidator(true);

// generic route handler
const genericRouteHandler = (req, res, next) => {
    res.json({
        status: 'success',
        data: req.body
    });
};

// create a new teacher or student
router.post('/people', validateRequest, genericRouteHandler);

// change creds for teachers
router.post('/auth/edit', validateRequest, genericRouteHandler);

// accept fees for students
router.post('/fees/pay', validateRequest, genericRouteHandler);

module.exports = router;
