const axios = require('axios');

const router = require('express').Router();
const verify_middleware = require("../auth/authenticate-middleware")

// * added in verify_middleware to the endpoint to verify user credentials
router.get('/', verify_middleware(), (req, res) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
});

module.exports = router;
