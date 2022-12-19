/**
 *
 * @param {Response} res Server response
 * @param {Number} status The status code returned
 * @param {Boolean} error The error boolean.
 * @param {*} data Data that will be passed;
 * @returns {any}
 */
module.exports = (res, status = 200, error = false, data) => {
  return res.status(status).json({ error, data }).end();
};
