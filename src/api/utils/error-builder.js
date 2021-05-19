module.exports = function errorBuilder (message, statusCode = 400) {
  return { message, statusCode }
}
