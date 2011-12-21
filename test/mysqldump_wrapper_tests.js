var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    cli = require('cli'),
    mysqldump = require('../lib/mysqldump_wrapper'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('build', function(){

    describe('mysqldump#schema', function(){
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
            mysqldump.schema(config, "wp_commentmeta wp_comments wp_links wp_options wp_postmeta wp_posts wp_terms wp_term_relationships wp_usermeta wp_users", function(dumptext, error) {
               sql = dumptext;
               done(error);
            });
        });

        it('should contain table definitions', function(){
            cli.debug(sql);
            sql.should.include.string("wp_commentmeta");
        });
    });
});

