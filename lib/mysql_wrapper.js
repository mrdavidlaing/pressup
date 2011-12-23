var cli = require('cli'),
    util = require('util'),
    exec = require('child_process').exec;

var mysql =  {
    process: function(config, sql, callback){
        var cmd = "mysql --user="+config.db.db_admin_user
                + " --password=" +config.db.db_admin_password
                + " --database=" + config.db.db_name
                + " --execute \"" + sql + "\"";

        exec(cmd, 
          function (error, stdout, stderr) {
            if (error !== null) {
              cli.error('Error when executing:\n' + cmd + '\n' + error);
            }
            callback(stdout, error);
        });

        return true;
    },    
    process_file: function(config, file, callback){
        var cmd = "mysql --user="+config.db.db_admin_user
                + " --password=" +config.db.db_admin_password
                + " --database=" + config.db.db_name
                + " < " + file;

        exec(cmd, 
          function (error, stdout, stderr) {
            if (error !== null) {
              cli.error('Error when executing:\n' + cmd + '\n' + error);
            }
            callback(stdout, error);
        });

        return true;
    }
};

module.exports = mysql;
