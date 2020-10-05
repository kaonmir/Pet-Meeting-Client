module.exports = {
  success: (result) => {
    return {
      status: true,
      result: result,
    };
  },

  fail: (message) => {
    console.log(message);
    return {
      status: false,
      message: `${message}`,
    };
  },
};
