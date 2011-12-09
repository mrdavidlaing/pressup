var cli = require('cli'),
    fs  = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var symlink = function (target_path, source_path) {
    cli.info("\t" + target_path + " => " + source_path);
    if (path.existsSync(target_path)) {
        fs.unlinkSync(target_path);
    }
    fs.symlinkSync(path.resolve(source_path), target_path);
}

var build = function(args, config) {
    cli.info('Building ');

    var fqdn_path = "httpdocs/" + config.fqdn,
        versioned_path = fqdn_path + "/v" + config.version,
        uploads_path =  fqdn_path + "/uploads";

    if (!path.existsSync(fqdn_path)) fs.mkdirSync(fqdn_path, 0744);
    if (!path.existsSync(uploads_path)) fs.mkdirSync(uploads_path, 0764);
    cli.info('Created uploads folder: ' + uploads_path);
    if (!path.existsSync(versioned_path)) fs.mkdirSync(versioned_path, 0744);
    cli.info('Created versioned target folder: '+versioned_path);

    cli.info("Linking to wordpress:");
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

    cli.info("Creating wp-content");
    ["wp-content", "wp-content/plugins", "wp-content/themes"].forEach(function(folder) {
        var the_folder = versioned_path + "/" + folder;
        if (!path.existsSync(the_folder)) {
             fs.mkdirSync(the_folder, 0744);
        }
    });

    cli.info("Linking to uploads")
    symlink(versioned_path + "/wp-content/uploads", uploads_path);

    cli.info("Building plugins");
    for (plugin_name in config.plugins) {
        var plugin = config.plugins[plugin_name];
        if (plugin.build_action === "link")
        {
           symlink(versioned_path + "/wp-content/plugins/" + plugin_name, plugin.source);
        }
    }

    cli.info("Building themes");
    for (theme_name in config.themes) {
        var theme = config.themes[theme_name];
        if (theme.build_action === "link")
        {
           symlink(versioned_path + "/wp-content/themes/" + theme_name, theme.source);
        }
    }

    return true;
}

module.exports = build;