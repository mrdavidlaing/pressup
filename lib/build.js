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
    fs_helpers.mkdir(uploads_path, global_config.built.uid, global_config.built.gid, 0777);
    cli.info('Created uploads folder: ' + uploads_path);

    if (path.existsSync(path.resolve(versioned_path))) {
        cli.info('Deleting existing versioned target folder: '+versioned_path);
        fs_helpers.rmdirSyncRecursive(versioned_path);
    }
    fs_helpers.mkdir(versioned_path, global_config.built.uid, global_config.built.gid, 0755);
    cli.info('Created versioned target folder: '+versioned_path);

    cli.info("Copying wordpress:");
    fs_helpers.copyRecursiveSync(base_folder + "/" + config.wordpress, versioned_path);

    cli.info("Creating wp-config.php");
    var wpconfigsample = versioned_path + "/wp-config-sample.php";
    var wpconfig = build.__replace_config_values(fs.readFileSync(wpconfigsample, 'utf8'),config);
    fs.writeFileSync(versioned_path + "/wp-config.php", wpconfig);
    fs_helpers.rm(wpconfigsample);

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
        else if (plugin.build_action === "copy")
        {
           fs_helpers.copyRecursiveSync(plugin.source, versioned_path + "/wp-content/plugins/" + plugin_name);
        }
    }

    cli.info("Building themes");
    for (theme_name in config.themes) {
        var theme = config.themes[theme_name];
        if (theme.build_action === "link")
        {
           fs_helpers.symlink(versioned_path + "/wp-content/themes/" + theme_name, theme.source);
        }
        else if (theme.build_action === "copy")
        {
           fs_helpers.copyRecursiveSync(theme.source, versioned_path + "/wp-content/themes/" + theme_name);
        }
    }

    cli.info("Fixing permissions");
    fs_helpers.fixpermissionsRecursiveSync(versioned_path, global_config.built.uid, global_config.built.gid, 0755);
    debugger;
    fs_helpers.fixpermissionsRecursiveSync(uploads_path, global_config.built.uid, global_config.built.gid, 0777);
    fs_helpers.fixpermissionsRecursiveSync(versioned_path + "/wp-content/themes", global_config.built.uid, global_config.built.gid, 0775);

    return true;
};

build.__replace_config_values = function(wpconfig, config) {
    var updated_wpconfig = wpconfig.replace('database_name_here',config.db.db_name)
                                   .replace('username_here',config.db.db_user)
                                   .replace('password_here',config.db.db_password)
                                   .replace('put your unique phrase here',config.salts.AUTH_KEY)
                                   .replace('put your unique phrase here',config.salts.SECURE_AUTH_KEY)
                                   .replace('put your unique phrase here',config.salts.LOGGED_IN_KEY)
                                   .replace('put your unique phrase here',config.salts.NONCE_KEY)
                                   .replace('put your unique phrase here',config.salts.AUTH_SALT)
                                   .replace('put your unique phrase here',config.salts.SECURE_AUTH_SALT)
                                   .replace('put your unique phrase here',config.salts.LOGGED_IN_SALT)
                                   .replace('put your unique phrase here',config.salts.NONCE_SALT)

        ;

    return updated_wpconfig;
};

module.exports = build;
