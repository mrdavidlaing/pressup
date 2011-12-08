var cli = require('cli');

var db =  {
    backup: function(){
        cli.info('Backup');
        return true;
    },
    restore: function(){
        cli.info('restore');
        return true;
    }
};

module.exports = db;