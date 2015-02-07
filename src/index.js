var Octokat = require('octokat');

function asyncLoad(ids, load, done) {
  var completed = 0;
  var loaded = [];

  ids.forEach(function(id, index) {
    load(id, function(err, el) {
      if (err) return done(err);

      loaded[index] = el;
      if (++completed === ids.length) return done(null, loaded);
    });
  });
}

function userBuild(pulls, statuses) {
  return pulls.reduce(function(acc, p, i) {
    var status = statuses[i][0];

    acc[p.user.login] = status.state;

    return acc;
  }, {});
}

function loadStatus(pull, cb) {
  pull.statuses()

  .then(function(res) {
    cb(null, res);
  })

  .then(null, function (err) {
    cb(err);
  });
}

function loadPulls(name, cb) {
  var repo = this.octo.repos.apply(this.octo, name.split('/'));

  repo.fetch()

  .then(function(r) {
    return r.pulls.fetch();
  })

  .then(function(pulls) {
    if(pulls.length === 0) {
      cb(null, { repo: name, build: null})
    } else {
      asyncLoad(pulls, loadStatus, function(err, statuses) {
        if (err) return cb(err);
        cb(null, { repo: name, build: userBuild(pulls, statuses) });
      });
    }
  })

  .then(null, function(err) {
    cb(err);
  });
}

function HomeworkResults(options) {
  if (options.username && options.password) {
    this.octo = new Octokat(options);
  } else {
    this.octo = new Octokat();
  }
}

HomeworkResults.prototype.get = function(repos, cb) {
  asyncLoad(repos, loadPulls.bind(this), cb);
};

global.HomeworkResults = HomeworkResults;
