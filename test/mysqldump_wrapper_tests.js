var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    cli = require('cli'),
    mysqldump = require('../lib/mysqldump_wrapper'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('mysqldump', function(){

    describe('schema', function(){
        var sql = "";
        before(function(done){
            var config = {
                "db": {
                    "db_name": "forsitethemes_local",
                    "db_user": "wp_user",
                    "db_password": "wp_user_password",
                    "db_admin_user": "root",
                    "db_admin_password": "QzEoS8z4UjN0dIQArowX"
                }
            };
            mysqldump.schema(config, "wp_commentmeta", function(dumptext, error) {
               sql = dumptext;
               cli.debug(sql);
               done(error);
            });
        });

        it('should contain table definitions', function(){
            sql.should.include.string("CREATE TABLE");
        });

        it('should contain drop table', function(){
            sql.should.include.string("DROP TABLE IF EXISTS");
        });

         it('should not contain AUTO_INCREMENT={row_count} statements', function(){
            sql.should.not.include.string("AUTO_INCREMENT=");
        });
    });

    describe('data', function(){
        var sql = "";
        before(function(done){
            var config = {
                "db": {
                    "db_name": "forsitethemes_local",
                    "db_user": "wp_user",
                    "db_password": "wp_user_password",
                    "db_admin_user": "root",
                    "db_admin_password": "QzEoS8z4UjN0dIQArowX"
                }
            };
            mysqldump.data(config, "wp_posts", function(dumptext, error) {
               sql = dumptext;
               cli.debug(sql);
               done(error);
            });
        });

        it('should contain table definitions', function(){
            sql.should.include.string("table_data name=\"wp_posts\"");
        });
    });
});

