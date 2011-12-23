var cli = require('cli'),
    mysqldump = require('./mysqldump_wrapper'),
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
            mysqldump.schema(config, table, function(dumptext, error) {
                fs.writeFileSync(folder + "/" + table + ".sql", dumptext);
            });
            mysqldump.data(config, table, function(dumptext, error) {
               fs.writeFileSync(folder + "/" + table + ".xml", dumptext);
            });
        });

        return true;
    },
    restore: function(args, config){
        cli.info('restore');
        return true;
    }
};

module.exports = db;