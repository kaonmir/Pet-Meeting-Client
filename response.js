module.exports = {
  success: (result) => {
    return {
      status: true,
      message: "success",
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
