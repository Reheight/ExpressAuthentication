module.exports = {
  displayName: /^[a-zA-Z0-9.-_ ]{3,16}$/,
  username: /^[a-zA-Z0-9.-_]{3,10}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  emailAddress: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,8})+$/,
};
