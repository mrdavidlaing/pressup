var cli = require('cli');

var theme =  {
    create: function(){
        cli.info('Backup');
        return true;
    }
};

module.exports = theme;