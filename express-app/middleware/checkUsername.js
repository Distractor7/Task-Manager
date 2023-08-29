// Custom middleware function is exported as a module to be used in other parts of the application.
module.exports = (req, res, next) => {
  // Test on req body to see if it is json and then another test is done to see if the username ends with @gmail.com
  if (req.is("json")) {
    const { username } = req.body;
    if (username.endsWith("@gmail.com")) {
      // Next method hands over to next middleware function.
      next();
    } else {
      // If user name not appropriate then a console. Error is logged.
      res.status(403).send("Username must end with '@gmail.com'");
    }
  } else {
    // If content type not json then an error message is logged to the console.
    res.status(400).send("Content type must be JSON");
  }
};
