var cli = require('cli'),
    fs  = require('fs'),
    fs_helpers  = require('./fs_helpers'),
    path = require('path'),
    exec = require('child_process').exec,
    global_config = require('./global_config'),
    _ = require('underscore');

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
    fs_helpers.copyRecursiveSync(base_folder + "/" + config.wordpress.source, versioned_path);

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
            cli.info("\tLinking plugin " + plugin_name);
        }
        else if (plugin.build_action === "copy")
        {
            fs_helpers.copyRecursiveSync(plugin.source, versioned_path + "/wp-content/plugins/" + plugin_name);
	        cli.info("\tCopying plugin " + plugin_name);
        }
    }

    cli.info("Building themes");
    for (theme_name in config.themes) {
        var theme = config.themes[theme_name];
        if (theme.build_action === "link")
        {
           fs_helpers.symlink(versioned_path + "/wp-content/themes/" + theme_name, theme.source);
	   cli.info("\tLinking theme " + theme_name);
        }
        else if (theme.build_action === "copy")
        {
           fs_helpers.copyRecursiveSync(theme.source, versioned_path + "/wp-content/themes/" + theme_name);
	   cli.info("\tCopying plugin " + theme_name);
        }
    }

    cli.info("Fixing permissions");
    fs_helpers.fixpermissionsRecursiveSync(versioned_path, global_config.built.uid, global_config.built.gid, 0755);
    fs_helpers.fixpermissionsRecursiveSync(uploads_path, global_config.built.uid, global_config.built.gid, 0777);
    fs_helpers.fixpermissionsRecursiveSync(versioned_path + "/wp-content/themes", global_config.built.uid, global_config.built.gid, 0775);
    fs.chmodSync(versioned_path + "/wp-content", 0775);
    return true;
};

build.__replace_config_values = function(wpconfig, config) {
    var update_define = function(str, key, value) {
        var regEx = new RegExp("define\\s*?\\(\\s*?'"+key+"'\\s*?,.*?\\)\\s*?;", "img"),
            quoted_value = _(value).isString(value)? "'"+value+"'" : value.toString();

        return str.replace(regEx,"define('"+key+"', " + quoted_value + ");");
    },
    ret = wpconfig;
    
    ret = update_define(ret, 'DB_NAME',config.db.db_name);
    ret = update_define(ret, 'DB_USER',config.db.db_user);
    ret = update_define(ret, 'DB_PASSWORD',config.db.db_password);
    ret = update_define(ret, 'SECURE_AUTH_KEY',config.salts.SECURE_AUTH_KEY);
    ret = update_define(ret, 'AUTH_KEY',config.salts.AUTH_KEY);
    ret = update_define(ret, 'LOGGED_IN_KEY',config.salts.LOGGED_IN_KEY);
    ret = update_define(ret, 'NONCE_KEY',config.salts.NONCE_KEY);
    ret = update_define(ret, 'SECURE_AUTH_SALT',config.salts.SECURE_AUTH_SALT);
    ret = update_define(ret, 'LOGGED_IN_SALT',config.salts.LOGGED_IN_SALT);
    ret = update_define(ret, 'NONCE_SALT',config.salts.NONCE_SALT);
    ret = update_define(ret, 'AUTH_SALT',config.salts.AUTH_SALT);
    if (!_.isUndefined(config.wordpress.debug)) {
        ret = update_define(ret, 'WP_DEBUG', config.wordpress.debug);
    }
    
    
    return ret;
};

module.exports = build;
