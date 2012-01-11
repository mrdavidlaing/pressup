var path = require('path'),
    global_config = {
        built: {
            gid: 33, //www-data - TODO how do we look this up dynamically?
            uid: process.getuid()
        },
        pressup: {
            templates_folder: path.join(path.resolve(__dirname,".."),"/templates")
        }
    };

module.exports = global_config;
