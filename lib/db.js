var cli = require('cli'),
    util = require('util'),
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
        var folder = "db/" + config.db.db_name, 
            files = fs.readdirSync(folder),
            target_config = config;
        if (args.length > 0 && _s.startsWith(args[0], "target")) { 
            target_config = JSON.parse(fs.readFileSync(_s.strRight(args[0],'='), 'utf8'));
        }    
            
        cli.info('Restoring database from ' + folder + " to database " + target_config.db.db_name);
        
        files.forEach(function(file) {
            if(_s.endsWith(file, '.data.sql')) {
                var table = _s.strLeft(file,'.');
                
                mysql.process_file(target_config, folder + "/" + table + ".sql", function(result,error) {
                    if (!error) {
                        mysql.process_file(target_config, folder + "/" + table + ".data.sql", function(result,error) { 
                            if (error) {
                                cli.error(error); 
                            } else {
                                cli.info("Restored " + table);
                                if (_s.endsWith(table, "options")) {
                                   var siteurl = 'http://' + target_config.fqdn,
                                   sql = "UPDATE " + table + " SET option_value = '"+siteurl+"' WHERE option_name IN ('siteurl','home')"
                                   mysql.process(target_config, sql, function(result, error) {
                                       if (!error) {
                                            cli.info("Updated "+table+"[siteurl] and "+table+"[home] to '"+siteurl+"'");
                                       }  
                                   }) 
                                }
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