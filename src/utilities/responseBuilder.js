module.exports = (res, status = 200, error = false, data) => {
  return res.status(status).json({ error, data }).end();
};
