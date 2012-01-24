#!/usr/bin/env node

var program = require('commander'),
    async = require('async'),
    color = require('color'),
    util = require('util'),
    _ = require('underscore'),
    current_sites = ['site1', 'site2'],
    get_config = function(callback) {
      if (program.siteConfig) callback(program.siteConfig);
      console.log("Select the site config:")
      program.choose(current_sites, function(i) {
         config = current_sites[i];
         process.stdin.destroy();
         callback(config);
      });   
    };

var validation = {
  valid_site_name: function(siteName) {
    if (siteName.length<2) {
      return { isValid: false, message: "Site name must be longer than 2 characters" };
    }

    return { isValid: true };
  }
};

var prompts = {
  get_site_name: function(config, callback) {
    program.prompt('Site name: ', function(newSiteName){
      var is_valid_site_name = validation.valid_site_name(newSiteName);
      if (is_valid_site_name.isValid) {
        config.name = newSiteName;
        callback(null, config);
      } else {
        console.log(is_valid_site_name.message);
        prompts.get_site_name(config, callback);
      } 
    });
  },
  select_site_config: function(callback) {
    console.log("Select existing site:")
    program.choose(current_sites, function(i) {
      callback(null, JSON.parse('{"type":"'+current_sites[i]+'"}'));
    }); 
  },
  get_site_to_copy: function(callback) {
    program.confirm('Copy an existing site? ', function(shouldCopyExistingSite){
      if (shouldCopyExistingSite) {
        prompts.select_site_config(callback); 
      } else {
        callback(null,{});
      }
    });
  }
}

console.log("|---------------------------------------------------------|");
console.log("|  PressUp - automating WordPress development since 2011  |");
console.log("|---------------------------------------------------------|");

program
  .version('0.0.1')
  .on('--help', function(){
    console.log('  Usage notes:');
    console.log('');
    console.log('    You must specify which [command] you want to run.');
    console.log('    Where a command requires further arguments these can');
    console.log('    be specified as options, or you will be prompted to');
    console.log('    answer a series of questions');
    console.log('');
  });

//Init 
program
  .command('init [site-name]')
  .description('Initialise a new site configuration (creates config/[site-name].json)')
  .option('-c, --copy-existing-site <template-site-name>', 'Copy all settings from an existing site')
  .action(function(siteName, options){
    async.waterfall([
        /* copyExistingSite*/ function(callback){
          if (program.copyExistingSite) {
            callback(null, JSON.parse('{"type":"the-existing-site-name"}'));
          } else {
            prompts.get_site_to_copy(callback);
          }
        },
        /* Site name */ function(config, callback){
          if (siteName) {
            config.name = siteName;
            callback(null, config);
          } else {
            prompts.get_site_name(config, callback);
          }
        },
        /* do init */ function(config, callback) {
          process.stdin.destroy();
          console.log('Executing: pressup_new.js init %s -c %s', config.name, config.copy_of);
          console.log('Init new site: '+util.inspect(config));
        }
      ],
      /* handle error */ function(err) {
          process.stdin.destroy();
          console.log('An error occured: '+util.inspect(err));
      });
    });

//Build command
program
  .command('build')
  .description('"compile" the specified site config for environment <env>')
  .option('-s, --site <site-name>', 'site to build')
  .action(function(options){
    async.waterfall([
        /* Site name */ function(callback){
          if (program.site) {
            config.name = options.site;
            callback(null, config);
          } else {
            prompts.select_site_config(callback);
          }
        },
        /* do build */ function(config, callback) {
          process.stdin.destroy();
          console.log('Build site: '+util.inspect(config));
        }
      ],
      /* handle error */ function(err) {
          process.stdin.destroy();
          console.log('An error occured: '+util.inspect(err));
      });
  });

//DB command
program
  .command('db:backup')
  .description('backup database')
  .option('-s, --site <site-path>', 'site of database to backup')
  .action(function(options){
    console.log("db backup");
  });

//DB command
program
  .command('db:restore')
  .description('restore database')
  .option('-t, --target-site <site-name>', 'target site to restore database to')
  .option('-s, --source-site <site-name>', 'source site to restore database from')
  .action(function(options){
    console.log("db restore");
  });

if(process.argv.length === 2) process.argv.push('-h'); //default to showing help when no args
program.parse(process.argv);

