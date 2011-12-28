var cli = require('cli'),
    mysqldump = require('./mysqldump_wrapper'),
    mysql = require('./mysql_wrapper'),
    fs_helpers = require('./fs_helpers'),
    _s = require('underscore.string'),
    fs = require('fs');

var db =  {
    backup: function(args, config){
        cli.info('Backup');
        var folder = "db/" + config.db.db_name;
        fs_helpers.mkdir(folder, process.getuid(), process.getgid(), "0755");
        mysql.get_table_list(config, function(tables, error) {
            tables.forEach(function(table) {
                cli.info("Backing up " + table);
                mysqldump.schema(config, table, function(dumptext, error) {
                    fs.writeFileSync(folder + "/" + table + ".sql", dumptext);
                });
                mysqldump.data(config, table, function(dumptext, error) {
                   fs.writeFileSync(folder + "/" + table + ".data.sql", dumptext);
                });
            });
        });
        return true;
    },
    restore: function(args, config){
        cli.info('Restoring database ' + config.db.db_name);
        var folder = "db/" + config.db.db_name, 
            files = fs.readdirSync(folder);
        
        files.forEach(function(file) {
            if(_s.endsWith(file, '.data.sql')) {
                var table = _s.strLeft(file,'.');
                
                mysql.process_file(config, folder + "/" + table + ".sql", function(result,error) {
                    if (!error) {
                        mysql.process_file(config, folder + "/" + table + ".data.sql", function(result,error) { 
                            if (error) {
                                cli.error(error); 
                            } else {
                                cli.info("Restored " + table);
                            } 
                        });
                    }   
                });
            }
        });
        return true;
    }
};

module.exports = db;