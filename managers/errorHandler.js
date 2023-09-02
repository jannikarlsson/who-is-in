const handleServerError = (res, err) => {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = { handleServerError };
