var cli = require('cli');

var plugin =  {
    create: function(){
        cli.info('Backup');
        return true;
    }
};

module.exports = plugin;