
var cli = require('cli'),
    pressup = {
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

cli.main(function (args, options) {
      if (this.command.toLowerCase() == "init")
      {
          return pressup.init(args[0]);
      }

      if (!options.config) this.fatal('--config is required');

      this.info('Using config: ' + options.config);

      switch(this.command.toLowerCase()) {
          case 'build':
            pressup.build(args);
            break;
          case 'plugin:create':
            pressup.plugin.create(args);
            break;
          case 'theme:create':
            pressup.theme.create(args);
            break;
          case 'db:backup':
            pressup.db.backup(args);
            break;
          case 'db:restore':
            pressup.db.restore(args);
            break;

          default:
            this.info('Command is: ' + this.command);
      }

      this.ok("DONE!");
});

