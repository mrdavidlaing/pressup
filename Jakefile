sys = require('util');

desc('SpeedyPress is wordpress optimised for theme and plugin developers');
task('default', [], function () {
  console.log('run jake -T for all the available options');
});

namespace('plugin', function () {
  desc('Create a new plugin');
  task('create', [], function () {
    console.log('doing plugin:create task');
  });
});

namespace('theme', function () {
  desc('Create a new theme');
  task('create', [], function () {
    console.log('doing theme:create task');
  });
});


namespace('db', function () {
  desc('Dump the current database to data/db/{dbname}-{yyyymmdd-hhmmss}.sql.zip');
  task('dump', [], function () {
    console.log('Dumping database');
  });
  desc('Restore database dump');
  task('restore', [], function () {
    console.log('Restoring database');
  });
});
