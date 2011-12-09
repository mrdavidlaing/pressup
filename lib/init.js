var cli = require('cli'),
    fs = require('fs'),
    path = require('path'),
    util = require('util');

var init = function(the_folder) {
    if (the_folder === undefined || the_folder === null) {
        cli.error("folder to init required");
        return false;
    }

    cli.info("Setting up folder structure in: " + the_folder);
    [   "/conf",
        "/conf/nginx",
        "/db",
        "/httpdocs",
        "/lib",
        "/lib/wordpress",
        "/src",
        "/src/plugins",
        "/src/themes",
        "/test"
    ].forEach(function(sub_folder) {
        if (!path.existsSync(the_folder + sub_folder)) {
             fs.mkdirSync(the_folder + sub_folder, 0744);
        }
        cli.info("\t" + sub_folder);
    });

    return true;
}

module.exports = init;