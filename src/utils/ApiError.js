class ApiError extends Error {
  //IT IS A CUSTOM ERROR CLASS WHICH IS USED TO HANDLE ERRORS
  constructor(
    statusCode, // IT IS A STATUS CODE OF THE ERROR
    message = "something went wrong", // IT IS A MESSAGE OF THE ERROR
    errors = [], // IT IS A ARRAY OF ERRORS WHICH IS USED TO HANDLE ERRORS
    stack = "" //IT IS A STACK OF THE ERROR WHICH IS USED TO HANDLE ERRORS
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
      // console.log("I GOT ERROR");
    }
  }
}

export default ApiError;
