var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    cli = require('cli'),
    mysql = require('../lib/mysql_wrapper'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('mysql', function(){

    describe('process', function(){
        var sql = "";
        before(function(done){
            var config = {
                "db": {
                    "db_name": "weddingwire_local",
                    "db_user": "wp_user",
                    "db_password": "wp_user_password",
                    "db_admin_user": "root",
                    "db_admin_password": "QzEoS8z4UjN0dIQArowX"
                }
            },
            sql_file = path.resolve('test/sample_repo/db/weddingwire_local/wp_posts.data.sql');
            mysql.process_file(config, sql_file, function(result, error) {
               sql = result;
               cli.debug(sql);
               done(error);
            });
        });

        it('should contain table definitions', function(){
            sql.should.include.string("CREATE TABLE");
        });
    });
});

