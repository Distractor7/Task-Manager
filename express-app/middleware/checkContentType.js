// Custom middleware function is exported as a module to be used in other areas of the application.
module.exports = (req, res, next) => {
  // Checks if request is post, put or delete request.
  const methodsToCheck = ["POST", "PUT", "DELETE"];
  // If request does not come in json form then a 400 error is logged with message to the console.
  if (methodsToCheck.includes(req.method) && !req.is("json")) {
    res.status(400).send("Bad Request: Content type must be JSON");
  } else {
    next();
  }
};
