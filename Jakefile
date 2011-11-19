var sys = require('util'),
    config = { server: "www1-new.web-angle.com",
               db_root_password: "QzEoS8z4UjN0dIQArowX",
               db_name: "wordpress_3_2_1" },
    exec = require('child_process').exec;

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
  desc('Dump the current database to db/{dbname}-{yyyymmdd-hhmmss}.sql.zip');
  task('dump', [], function () {
      var dump_file_name = "db/" + config.db_name + ".sql.gz",
          cmd = "ssh " + config.server + " 'mysqldump -p\"" + config.db_root_password + "\" \"" + config.db_name + "\" | gzip' > " + dump_file_name;
      console.log('Dumping database using (could take a while): \n\t'+cmd); 
      exec(cmd, function (err, stdout, stderr) {
         if (stderr) {
           console.log('Error: ' + stderr);
         }
         if (stdout) {
           console.log(stdout);
         }
      }); 
  });

  desc('Restore database dump');
  task('restore', [], function () {
    console.log('Restoring database');
  });
});
