var global_config = {
    built: {
        gid: 33, //www-data - TODO how do we look this up dynamically?
        uid: process.getuid()
    }
};

module.exports = global_config;