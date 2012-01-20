#!/usr/bin/env node

var program = require('commander'),
    get_config = function(callback) {
      if (program.siteConfig) callback(program.siteConfig);
      var available_configs = ['conf/1.json', 'conf/2.json'];
      console.log("Select the site config:")
      program.choose(available_configs, function(i) {
         config = available_configs[i];
         process.stdin.destroy();
         callback(config);
      });   
    };

//Global options
program
  .version('0.0.1');

//Build command
program
  .command('build <env>')
  .description('"compile" the specified site config for environment <env>')
  .option('-s, --site-config <path>', 'set site config path')
  .action(function(env, options){
    var env = env || 'dev';
    get_config(function(config) {
      console.log('build for %s site for %s env(s)', env, config);
    });
  });

// program
//   .command('exec <cmd>')
//   .description('execute the given remote cmd')
//   .option("-e, --exec_mode <mode>", "Which exec mode to use")
//   .action(function(cmd, options){
//     console.log('exec "%s" using %s mode', cmd, options.exec_mode);
   
//     var list = ['tobi', 'loki', 'jane', 'manny', 'luna'];

//     console.log('Choose the coolest pet:');
//     program.choose(list, function(i){
//       console.log('you chose %d "%s"', i+1, list[i]);
//       console.log();
//       console.log('Choose the coolest pet, defaulting to loki:');
//       program.choose(list, 1, function(i){
//         console.log('you chose %d "%s"', i+1, list[i]);
//         process.stdin.destroy();
//       });
//     });
    
//   }).on('--help', function() {
//     console.log('  Examples:');
//     console.log();
//     console.log('    $ deploy exec sequential');
//     console.log('    $ deploy exec async');
//     console.log();
//   });

console.log("------------ PressUp - automating WordPress development since 2011 -----------");

program.parse(process.argv);

