// load dependencies
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const Routes = require("./routes");

const app = express();
const port = process.env.NODE_ENV || 3000;

// app configurations
app.set("port", port);

// load middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// load API routes
app.use("/", Routes);

// add /test route for joi testing

app.post("/test", (req, res, next) => {
  // require joi
  const Joi = require("joi");

  // fetch req data
  const data = req.body;

  // define validation schema
  const schema = Joi.object().keys({
    // email is required
    // email must be a valid email string
    email: Joi.string()
      .email()
      .required(),

    // phone is required
    // must be a string of the format xxx-xxx-xxxx
    // x is a digit (0-9)
    phone: Joi.string()
      .regex(/^\d{3}-\d{3}-\d{4}$/)
      .required(),

    // birthday is not required
    // must be a valid ISO-8601 date
    // dates before Jan, 1, 2004 not allowed
    birthday: Joi.date()
      .max("1-1-2004")
      .iso()
  });
  // validate request data against schema
  Joi.validate(data, schema, (err, value) => {
    // create a rando num as id
    const id = Math.ceil(Math.random() * 9999999);

    if (err) {
      // send a 422 error res if validations fails
      res.status(422).json({
        status: "error",
        message: "Invalid request data",
        data: data
      });
    } else {
      // send a success response if validation passes
      // attach rando id to the response data
      res.json({
        status: "success",
        message: "User created successfully",
        data: Object.assign({ id }, value)
      });
    }
  });
});

// establish http server connection
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
