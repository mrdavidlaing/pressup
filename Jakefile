if (process.env.config===undefined)
{
    console.log("ERROR: You must pass the config=conf/{name}.json argument");
    process.exit();
}

var sys = require('util'),
    fs  = require('fs'),
    wrench = require('wrench'),
    path = require('path'),
    config = JSON.parse(fs.readFileSync(process.env.config, 'utf8')),
    exec = require('child_process').exec;

console.log("Using conf: "+process.env.config);

desc('PressUp is wordpress optimised for theme and plugin developers');
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

var symlink = function (target_path, source_path) {
    console.log("\t" + target_path + " => " + source_path);
    if (path.existsSync(target_path)) {
        fs.unlinkSync(target_path);
    }
    fs.symlinkSync(path.resolve(source_path), target_path);
}
namespace('build', function () {
  desc('Create versioned build of site under httpdocs');
  task('build', [], function () {
    var fqdn_path = "httpdocs/" + config.fqdn,
        versioned_path = fqdn_path + "/v" + config.version,
        uploads_path =  fqdn_path + "/uploads";

    if (!path.existsSync(fqdn_path)) fs.mkdirSync(fqdn_path, 0744);
    if (!path.existsSync(uploads_path)) fs.mkdirSync(uploads_path, 0764);
    console.log('Created uploads folder: ' + uploads_path);
    if (!path.existsSync(versioned_path)) fs.mkdirSync(versioned_path, 0744);
    console.log('Created versioned target folder: '+versioned_path);

    console.log("Linking to wordpress:");
    [   "wp-admin",
        "wp-includes",
        "index.php",
        "wp-rdf.php",
        "wp-register.php",
        "wp-cron.php",
        "wp-rss.php",
        "wp-activate.php",
        "wp-feed.php",
        "wp-rss2.php",
        "wp-settings.php",
        "wp-app.php",
        "wp-links-opml.php",
        "wp-signup.php",
        "wp-atom.php",
        "wp-load.php",
        "wp-trackback.php",
        "wp-blog-header.php",
        "wp-login.php",
        "xmlrpc.php",
        "wp-comments-post.php",
        "wp-mail.php",
        "wp-commentsrss2.php",
        "wp-pass.php"
    ].forEach(function(file) {
        symlink(versioned_path + "/" + file, config.wordpress + "/" + file);
    });

    console.log("Creating wp-content");
    ["wp-content", "wp-content/plugins", "wp-content/themes"].forEach(function(folder) {
        var the_folder = versioned_path + "/" + folder;
        if (!path.existsSync(the_folder)) {
             fs.mkdirSync(the_folder, 0744);
        }
    });

    console.log("Linking to uploads")
    symlink(versioned_path + "/wp-content/uploads", uploads_path);

    console.log("Building plugins");
    for (plugin_name in config.plugins) {
        var plugin = config.plugins[plugin_name];
        if (plugin.build_action === "link")
        {
           symlink(versioned_path + "/wp-content/plugins/" + plugin_name, plugin.source);
        }
    }

    console.log("Building themes");
    for (theme_name in config.themes) {
        var theme = config.themes[theme_name];
        if (theme.build_action === "link")
        {
           symlink(versioned_path + "/wp-content/themes/" + theme_name, theme.source);
        }
    }
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
