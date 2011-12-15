var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    global_config = require('../lib/global_config'),
    build = require('../lib/build'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers'),
    wpsampleconfig = ""
+"define('DB_NAME', 'database_name_here');                     "
+"define('DB_USER', 'username_here');                          "
+"define('DB_PASSWORD', 'password_here');                      "
+"define('DB_HOST', 'localhost');                              "
+"define('DB_CHARSET', 'utf8');                                "
+"define('DB_COLLATE', '');                                    "
+"define('AUTH_KEY',         'put your unique phrase here');   "
+"define('SECURE_AUTH_KEY',  'put your unique phrase here');   "
+"define('LOGGED_IN_KEY',    'put your unique phrase here');   "
+"define('NONCE_KEY',        'put your unique phrase here');   "
+"define('AUTH_SALT',        'put your unique phrase here');   "
+"define('SECURE_AUTH_SALT', 'put your unique phrase here');   "
+"define('LOGGED_IN_SALT',   'put your unique phrase here');   "
+"define('NONCE_SALT',       'put your unique phrase here');   "
+"$table_prefix  = 'wp_';                                      "
+"define('WPLANG', '');                                        "
+"define('WP_DEBUG', false);                                   "
+"if ( !defined('ABSPATH') )                                   "
+"	define('ABSPATH', dirname(__FILE__) . '/');                "
+"require_once(ABSPATH . 'wp-settings.php');                   ";

describe('build', function(){

    describe('__replace_config_values', function(){
        var wpconfig = "";
        before(function(){
            var config = {
                fqdn: "test.domain.com",
                version: 42,
                "db": {
                    "db_name": "the_db_name",
                    "db_user": "wp_user",
                    "db_password": "wp_user_password",
                    "db_admin_user": "root",
                    "db_admin_password": "root_password"
                },
                "salts": {
                    "AUTH_KEY":         "the_auth_key",
                    "SECURE_AUTH_KEY":  "the_secure_auth_key",
                    "LOGGED_IN_KEY":    "the_logged_in_key",
                    "NONCE_KEY":        "the_nonce_key",
                    "AUTH_SALT":        "the_auth_salt",
                    "SECURE_AUTH_SALT": "the_secure_auth_salt",
                    "LOGGED_IN_SALT":   "the_logged_in_salt",
                    "NONCE_SALT":       "the_nonce_salt"
                },
                wordpress: "lib/wordpress/wordpress-3.3-RC2",
                plugins: {},
                themes: {}
            };
            wpconfig = build.__replace_config_values(wpsampleconfig, config);
        });

        it('should update DB_NAME', function(){
            wpconfig.should.include.string("define('DB_NAME', 'the_db_name');");
        });
        it('should update DB_USER', function(){
            wpconfig.should.include.string("define('DB_USER', 'wp_user');");
        });
        it('should update DB_PASSWORD', function(){
            wpconfig.should.include.string("define('DB_PASSWORD', 'wp_user_password');");
        });
        it('should update AUTH_KEY', function(){
            wpconfig.should.include.string("define('AUTH_KEY', 'the_auth_key');");
        });
        it('should update SECURE_AUTH_KEY', function(){
            wpconfig.should.include.string("define('SECURE_AUTH_KEY', 'the_secure_auth_key');");
        });
        it('should update LOGGED_IN_KEY', function(){
            wpconfig.should.include.string("define('LOGGED_IN_KEY', 'the_logged_in_key');");
        });
        it('should update NONCE_KEY', function(){
            wpconfig.should.include.string("define('SECURE_AUTH_SALT', 'the_nonce_key');");
        });
        it('should update AUTH_SALT', function(){
            wpconfig.should.include.string("define('AUTH_KEY', 'the_auth_salt');");
        });
        it('should update SECURE_AUTH_SALT', function(){
            wpconfig.should.include.string("define('SECURE_AUTH_SALT', 'the_secure_auth_salt');");
        });
        it('should update LOGGED_IN_SALT', function(){
            wpconfig.should.include.string("define('LOGGED_IN_SALT', 'the_logged_in_salt');");
        });
        it('should update NONCE_SALT', function(){
            wpconfig.should.include.string("define('NONCE_SALT', 'the_nonce_salt');");
        });
    });
});

