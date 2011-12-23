var cli = require('cli'),
    mysqldump = require('./mysqldump_wrapper'),
    mysql = require('./mysql_wrapper'),
    fs_helpers = require('./fs_helpers'),
    fs = require('fs');

var db =  {
    backup: function(args, config){
        cli.info('Backup');
        var folder = "db/" + config.db.db_name;
        fs_helpers.mkdir(folder, process.getuid(), process.getgid(), "0755");
        ['wp_commentmeta','wp_comments','wp_links','wp_options',
         'wp_postmeta','wp_posts','wp_terms','wp_term_relationships',
         'wp_usermeta','wp_users'].forEach(function(table) {
            cli.info("Backing up " + table);
            mysqldump.schema(config, table, function(dumptext, error) {
                fs.writeFileSync(folder + "/" + table + ".sql", dumptext);
            });
            mysqldump.data(config, table, function(dumptext, error) {
               fs.writeFileSync(folder + "/" + table + ".data.sql", dumptext);
            });
        });

        return true;
    },
    restore: function(args, config){
        cli.info('restore');
        var folder = "db/" + config.db.db_name;

        ['wp_commentmeta','wp_comments','wp_links','wp_options',
         'wp_postmeta','wp_posts','wp_terms','wp_term_relationships',
         'wp_usermeta','wp_users'].forEach(function(table) {
            cli.info("Restoring " + table);
            mysql.process_file(config, folder + "/" + table + ".sql", function(result,error) {
                if (!error) {
                    mysql.process_file(config, folder + "/" + table + ".data.sql", function(result,error) { 
                        if (error) cli.error(error); 
                    });
                }   
            });
        });
        return true;
    }
};

module.exports = db;