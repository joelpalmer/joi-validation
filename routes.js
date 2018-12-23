const express = require("express");
const router = express.Router();

// generic route handler
const genericRouteHandler = (req, res, next) => {
    res.json({
        status: 'success',
        data: req.body
    });
};

// create a new teacher or student
router.post('/people', genericRouteHandler);

// change creds for teachers
router.post('/auth/edit', genericRouteHandler);

// accept fees for students
router.post('/fees/pay', genericRouteHandler);

module.exports = router;
