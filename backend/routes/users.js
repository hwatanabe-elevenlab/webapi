var express = require('express');
var router = express.Router();
var cors = require('cors');
var fetch = require('node-fetch');
var passport = require('passport');

/* GET users listing. */
router.get('/', cors(), async function(req, res, next) {
  // const response = await fetch('http://ec2-3-134-99-99.us-east-2.compute.amazonaws.com:30000/samples/users');
  // const data = await response.json();
  // const users = data;
  const users = [{id: 1, name: 'test'}]
  res.send(users);
  console.log(req.session)
});

router.post('/login', passport.authenticate('cognito', {
  // successRedirect: '/',
  // failureRedirect: '/',
}));


module.exports = router;