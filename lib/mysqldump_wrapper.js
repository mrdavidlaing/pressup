var cli = require('cli'),
    util = require('util'),
    exec = require('child_process').exec;

var mysqldump =  {
    schema: function(config, tables, callback){
        cli.info('Dumping tables');
        var cmd = "mysqldump --user="+config.db.db_admin_user+" --password="+config.db.db_admin_password+" --skip-add-drop-table --no-data " + config.db.db_name + " " + tables;

        exec(cmd,
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
            }
            callback(stdout, error);
        });

        return true;
    },
    data: function(connection, table_mask, callback){
        cli.info('dumping data');
        return true;
    }
};

module.exports = mysqldump;
