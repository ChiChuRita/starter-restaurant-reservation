//default error handler for async functions
function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {
    Promise.resolve()
      .then(() => delegate(request, response, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        console.log("[Error on API call]:", { status, message });
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
