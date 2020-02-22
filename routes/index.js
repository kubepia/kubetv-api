var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200)
      .type("html")
      .send("api");
});

router.get("/health", function(req, res, next) {
  res.status(200)
      .type("html")
      .send("api");
});

module.exports = router;
