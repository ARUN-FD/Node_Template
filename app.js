const { networkInterfaces } = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const api = require('./routes/api')
const http = require('http');
const app = express();
const CONFIG = require('./config/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:",CONFIG.app)

//DATABASE
'use strict';
const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
          results[name].push(net.address);
          const url = new URL(`http://${results.wlp1s0}:${CONFIG.port}`);
          console.log(`Server listening on the ${url}`);
        }
    }
}

// CORS
app.use(cors());

//Api's
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    if (err.status === 404) {
        res.status(404).json({message: err.message})
    } else {
        res.status(500).json({message: err.message})
    }
});

module.exports = app;