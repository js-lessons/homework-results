require('../src/index.js');

var repos = [
  'js-lessons/js-basics-1',
  'js-lessons/js-basics-2',
  'js-lessons/js-basics-3',
  'js-lessons/js-basics-4'
];

loadBuild(repos, function(err, result) {
  console.log(result);
});
