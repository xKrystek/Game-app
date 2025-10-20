const healthCheck = (_, res) => {
  res.status(200).json({ status: 'ok' });
};

module.exports = healthCheck;
