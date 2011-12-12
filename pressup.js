
var cli = require('cli'),
    fs  = require('fs'),
    pressup = {
        check_prereqs: require('./lib/prereqs'),
        init: require('./lib/init'),
        build: require('./lib/build'),
        plugin: require('./lib/plugin'),
        theme: require('./lib/theme'),
        db: require('./lib/db')
    };

cli.parse(
    {
      config:  ['c', 'Config file to use', 'path']
    },
    ['init', 'build', 'plugin:create', 'theme:create', 'db:backup', 'db:restore'] //command list
);

pressup.check_prereqs();

cli.main(function (args, options) {
      if (this.command.toLowerCase() == "init")
      {
          return pressup.init(args[0]);
      }

      if (!options.config) this.fatal('--config is required');
      this.info('Using config: ' + options.config);
      var config = JSON.parse(fs.readFileSync(options.config, 'utf8'));

      switch(this.command.toLowerCase()) {
          case 'build':
            pressup.build(args, config);
            break;
          case 'plugin:create':
            pressup.plugin.create(args, config);
            break;
          case 'theme:create':
            pressup.theme.create(args, config);
            break;
          case 'db:backup':
            pressup.db.backup(args, config);
            break;
          case 'db:restore':
            pressup.db.restore(args, config);
            break;

          default:
            this.info('Command is: ' + this.command);
      }

      this.ok("DONE!");
});

