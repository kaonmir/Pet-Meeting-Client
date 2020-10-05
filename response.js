module.exports = {
  success: (result) => {
    return {
      status: true,
      result: result,
    };
  },

  fail: (message) => {
    return {
      status: false,
      message: `${message}`,
    };
  },
};
