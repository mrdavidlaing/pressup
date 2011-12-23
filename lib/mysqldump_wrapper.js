var cli = require('cli'),
    util = require('util'),
    exec = require('child_process').exec;

var mysqldump =  {
    schema: function(config, tables, callback){
        var cmd = "mysqldump --user="+config.db.db_admin_user
                + " --password="+config.db.db_admin_password
                + " --lock-tables --skip-comments "
                + " --add-drop-table --no-data "
                + config.db.db_name
                + " " + tables
                + " | sed 's/ AUTO_INCREMENT=[0-9]*\\b//'";

        exec(cmd, { encoding: 'utf8', maxBuffer: 20000*1024 },
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('Error when executing:\n' + cmd + '\n' + error);
            }
            callback(stdout, error);
        });

        return true;
    },
    data: function(config, tables, callback){
        var cmd = "mysqldump --user="+config.db.db_admin_user
                        + " --password="+config.db.db_admin_password
                        + " --lock-tables --skip-comments "
                        + " --replace --skip-extended-insert --skip-compact --order-by-primary --no-create-info "
                        + config.db.db_name
                        + " " + tables;

        exec(cmd, { encoding: 'utf8', maxBuffer: 20000*1024 },
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('Error when executing:\n' + cmd + '\n' + error);
            }
            callback(stdout, error);
        });

        return true;
    }
};

module.exports = mysqldump;
