// Asynchronous handler function that takes in a requestHandler as an argument
const asyncHandler = (requestHandlar) => {
  // an arrow function that takes in req, res, and next as arguments
   return (req, res, next) => {
    // Use Promise.resolve to convert the requestHandler into a promise
    Promise.resolve(requestHandlar(req, res, next))

      // Use catch to handle any errors that may occur
      .catch((err) => {
        // Call the next function with the error as an argument 
        next(err);
      });
  };
};

// Export the asyncHandler function as the default export
export default asyncHandler;

/*

// Asynchronous handler function that takes in a requestHandler as an argument
const asyncHandler = (requestHandlar) => {

  // Return an async arrow function that takes in req, res, and next as arguments
  return async (req, res, next) => {

    // Use a try-catch block to handle any errors that may occur
    try {

      // Await the resolution of the requestHandler promise
      await requestHandlar(req, res, next);
    } catch (err) {

      // Set the response status to 500
      res.status(500)

        // Send a JSON response with a success property set to false and the error message
       .json({
          success: false,
          message: err.message,
        });
    }
  };
};

// Export the asyncHandler function as the default export
export default asyncHandler;


*/
