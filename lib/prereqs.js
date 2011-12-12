var cli = require('cli');

var check_prereqs = function(args, config) {
    cli.info('Checking prereqs... ');

    //TODO:  ensure user is part of www-data group

    return true;
}

module.exports = check_prereqs;