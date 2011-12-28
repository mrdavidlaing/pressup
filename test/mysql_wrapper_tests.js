var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    cli = require('cli'),
    mysql = require('../lib/mysql_wrapper'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    config = {
                "db": {
                    "db_name": "weddingwire_local",
                    "db_user": "wp_user",
                    "db_password": "wp_user_password",
                    "db_admin_user": "root",
                    "db_admin_password": "QzEoS8z4UjN0dIQArowX"
                }
            },
    test_helpers = require('./test_helpers');

describe('mysql', function(){

    describe('process', function(){
        var out= "";
        before(function(done){
            var sql_file = path.resolve('test/sample_repo/db/weddingwire_local/wp_posts.data.sql');
            mysql.process_file(config, sql_file, function(result, error) {
               out = result;
              // cli.debug(out);
               done(error);
            });
        });

        it('should not throw an error', function(){
            //if we get here then it has passed
        });
    });
    
    describe('get_table_list', function(){
        var _tables = [];
        before(function(done){
            mysql.get_table_list(config, function(tables, error) {
               _tables = tables;
              // cli.debug(tables);
               done(error);
            });
        });

        it('should return an array of tables found in the database', function(){
            _tables.should.contain("wp_posts");
        });
        it('should not contain the database name', function(){
            _tables.should.not.contain("Tables_in_weddingwire_local");
        });
        it('should not contain an empty element', function(){
            _tables.should.not.contain("");
        });
        
    });
});

