// Middleware example
// Custom middlware function is exported as module to be used in other parts of application.
module.exports = (req, res, next) => {
  // Test on req body checks if the new task content is over 140 characters long.
  if (req.body.task && req.body.task.length <= 140) {
    // Next method hands over to next middle ware check.
    next();
  } else {
    // If req body is over 140 characters error is logged to the console.
    res.status(400).json({ error: "Task exceeds 140 characters" });
  }
};
