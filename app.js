var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// log setting. ommit the health check log
app.use(
    logger(':date[iso] GMT :method :status :response-time ms size: :res[content-length]\t :url', {
        skip: function (req, res) {
            return '/health' == req.path 
        }
      })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//TODO: make sure of base url v1 needed or not
app.use('/api', apiRouter);
app.disable('etag')
module.exports = app;
