require('./src/index');

var express = require('express');
var app = express();

var username = process.env.GITHUB_USERNAME;
var password = process.env.GITHUB_PASSWORD;

app.get('/results', function (req, res) {
  var repos = req.query.repos.split(',');

  var results = new HomeworkResults({
    username: username,
    password: password
  });

  results.get(repos, function(err, data) {
    if (err) res.status(403).send();

    res.jsonp(data);
  });
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
