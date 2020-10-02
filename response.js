module.exports = {
  success: (result) => {
    return {
      status: true,
      message: "success",
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
