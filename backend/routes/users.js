var express = require('express');
var router = express.Router();
var cors = require('cors');
var fetch = require('node-fetch');

/* GET users listing. */
router.get('/', cors(), async function(req, res, next) {
  const response = await fetch('http://192.168.100.14:30000/samples/users');
  const data = await response.json();
  const users = data;
  res.send(users);
});

module.exports = router;