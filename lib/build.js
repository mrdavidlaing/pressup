var cli = require('cli'),
    fs  = require('fs'),
    fs_helpers  = require('./fs_helpers'),
    path = require('path'),
    exec = require('child_process').exec,
    global_config = require('./global_config');

var build = function(args, config) {
    cli.info('Building ');

    var base_folder = args.base_folder || ".",
        fqdn_path = base_folder + "/httpdocs/" + config.fqdn,
        versioned_path = fqdn_path + "/v" + config.version,
        uploads_path =  fqdn_path + "/uploads";

    fs_helpers.mkdir(base_folder + "/httpdocs", global_config.built.uid, global_config.built.gid, 0755);
    fs_helpers.mkdir(fqdn_path, global_config.built.uid, global_config.built.gid, 0755);
    fs_helpers.mkdir(uploads_path, global_config.built.uid, global_config.built.gid, 0775);
    cli.info('Created uploads folder: ' + uploads_path);

    if (path.existsSync(path.resolve(versioned_path))) {
        cli.info('Deleting existing versioned target folder: '+versioned_path);
        fs_helpers.rmdirSyncRecursive(versioned_path);
    }
    fs_helpers.mkdir(versioned_path, global_config.built.uid, global_config.built.gid, 0755);
    cli.info('Created versioned target folder: '+versioned_path);

    cli.info("Linking to wordpress:");
    [   "wp-admin",
        "wp-includes",
        "index.php",
        "license.txt",
        "wp-activate.php",
        "wp-app.php",
        "wp-blog-header.php",
        "wp-comments-post.php",
        "wp-cron.php",
        "wp-links-opml.php",
        "wp-load.php",
        "wp-login.php",
        "wp-mail.php",
        "wp-pass.php",
        "wp-register.php",
        "wp-settings.php",
        "wp-signup.php",
        "wp-trackback.php",
        "xmlrpc.php"
    ].forEach(function(file) {
        fs_helpers.symlink(versioned_path + "/" + file, base_folder + "/" + config.wordpress + "/" + file);
    });

    cli.info("Fixing permissions of linked wordpress files");
    fs_helpers.fixpermissionsRecursiveSync(versioned_path,  global_config.built.uid, global_config.built.gid, 0755);

    cli.info("Creating wp-content, wp-content/plugins");
    ["wp-content", "wp-content/plugins"].forEach(function(folder) {
        var the_folder = versioned_path + "/" + folder;
        fs_helpers.mkdir(the_folder, global_config.built.uid, global_config.built.gid, 0755);
    });

    cli.info("Creating wp-content/themes");
    fs_helpers.mkdir(versioned_path + "/wp-content/themes", global_config.built.uid, global_config.built.gid, 0775);

    cli.info("Linking to uploads")
    fs_helpers.symlink(versioned_path + "/wp-content/uploads", uploads_path);

    cli.info("Building plugins");
    for (plugin_name in config.plugins) {
        var plugin = config.plugins[plugin_name];
        if (plugin.build_action === "link")
        {
           fs_helpers.symlink(versioned_path + "/wp-content/plugins/" + plugin_name, plugin.source);
        }
    }

    cli.info("Building themes");
    for (theme_name in config.themes) {
        var theme = config.themes[theme_name];
        if (theme.build_action === "link")
        {
           fs_helpers.symlink(versioned_path + "/wp-content/themes/" + theme_name, theme.source);
        }
    }

    return true;
}

module.exports = build;