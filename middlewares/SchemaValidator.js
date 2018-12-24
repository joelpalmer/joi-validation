const _ = require("lodash");
const Joi = require("joi");
const Schemas = require("../schemas");

module.exports = (useJoiError = false) => {
  // useJoiError determines if we should resond with the base Joi error
  // boolean: defaults to false
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

  // enabled HTTP methods for request data validation
  const _supportedMethods = ["post", "put"];

  // Joi validation options
  const _validationOptions = {
    abortEarly: false, // abort after last validation error
    allowUnknown: true, // allow unknowd keys that will be ignored
    stripUknown: true // strip unknown keys from the validated data
  };

  // return the validation middleware
  return (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();

    if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
      // get schema for the current route
      const _schema = _.get(Schemas, route);

      if (_schema) {
        // validate req.body using the schema and validation options
        return Joi.validate(
          req.body,
          _schema,
          _validationOptions,
          (err, data) => {
            if (err) {
              // Joi Error
              const JoiError = {
                status: "failed",
                error: {
                  original: err._object,

                  // fetch only the message and type from each error
                  details: _map(err.details, ({ message, type }) => ({
                    message: message.replace(/['"]/g, ""),
                    type
                  }))
                }
              };
              const CustomError = {
                status: "failed",
                error: "Invalid request data..."
              };
              // send back JSON error response
              res.status(422).json(_useJoiError ? JoiError : CustomError);
            } else {
              // replace req.body with the data after Joi validation
              req.body = data;
              next();
            }
          }
        );
      }
    }
    next();
  };
};
