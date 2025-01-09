const handleError = (res, error, message = 'Internal server error') => {
  console.error(error);
  res.status(500).json({ message, error: error.message });
};

module.exports = { handleError };