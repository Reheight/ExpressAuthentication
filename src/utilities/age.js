module.exports = function (birthdate = new Date(), age = 10) {
  const now = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = now.getTime() - birthdate.getTime();

  // Convert the time difference to years
  const x = timeDiff / (365.25 * 24 * 60 * 60 * 1000);

  // Check if the person is at least 18 years old
  if (x >= age) {
    return true;
  } else {
    return false;
  }
};
