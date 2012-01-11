var should = require('should'),
    fs = require('fs'),
    fs_helpers = require('../lib/fs_helpers'),
    path = require('path'),
    global_config = require('../lib/global_config'),
    build = require('../lib/build'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers'),
    config_of_custom_lib_site = {
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
        "wordpress" : {
            "source": "lib/wordpress/wordpress-3.3-RC2",
            "type": "multisite",
            "build_action": "copy"
        },
        plugins: {},
        themes: {}
    },
    config_for_wp_multisite_plus = {
        fqdn: "wp-multisite-plus.com",
        version: 1,
        "db": {
            "db_name": "wp_multisite_plus",
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
        "wordpress" : {
            "source": "{pressup_templates}/wordpress-3.3.1-multisite-plus/lib/wordpress",
            "type": "multisite",
            "build_action": "copy"
        },
        plugins: {},
        themes: {}
    };

describe('build', function(){
    describe('[a new versioned build]\n $ pressup build ' + sample_repo_folder, function(){
        var result = false, output="",
            file_with_bad_permissions = "wp-app.php";
            
        before(function() {

            fs.chownSync(sample_repo_folder + "/lib/wordpress/wordpress-3.3-RC2/" + file_with_bad_permissions, process.getuid(), process.getgid());  //break ownership
            fs.chmodSync(sample_repo_folder + "/lib/wordpress/wordpress-3.3-RC2/" + file_with_bad_permissions, 0600);  //break permissions

            result = build({base_folder: sample_repo_folder}, config_of_custom_lib_site);
        });

        it('should have returned true', function(){
          result.should.be.true;
        });
        it('should create a httpdocs/test.domain.com/v42 folder', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42").should.be.true;
        });
        it('should copy the wordpress files', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-admin").should.be.true;
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-app.php").should.be.true;
        });
        it('should create wp-config.php file', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-config.php").should.be.true;
        });
        it('should create delete wp-config-sample.php file', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-config-sample.php").should.be.false;
        });
        it('should fix the file permissions of linked files', function(){
            var fileStats = fs.statSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/" + file_with_bad_permissions);

            fileStats.uid.should.equal(global_config.built.uid);
            fileStats.gid.should.equal(global_config.built.gid);

            fs_helpers.modeSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/" + file_with_bad_permissions).octal.should.equal("100755");
        });
        it('should set the permissions on uploads/ to 777', function(){
            fs_helpers.modeSync(sample_repo_folder + "/httpdocs/test.domain.com/uploads").octal.should.equal("40777");
        });
        it('should set the permissions on all wp files as 755', function(){
            fs_helpers.modeSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-admin").octal.should.equal("40755");
        });
        it('should set the permissions on the folders correctly', function(){
            fs.statSync(sample_repo_folder + "/httpdocs").isDirectory().should.be.true;
            fs.statSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-admin").gid.should.equal(global_config.built.gid);
        });
    });
    describe('config structure' , function(){
        var result, output="";
        before(function(){

            var unhook = test_helpers.grab_output(function(string, encoding, fd) {
                output += string;
            });

            result = build({base_folder: sample_repo_folder},{
                "wordpress" : "path/to/wordpress"
            });
            
            unhook();
        });

        it('should throw an error if config.wordpress element is of wrong format ', function(){
          result.should.be.false;
          output.should.match(/(.*)invalid format for config.wordpress element(.*)/);
        });
    });
    
    describe('built-in wordpress templates' , function(){
        var result, output="";
        before(function(){

            var unhook = test_helpers.grab_output(function(string, encoding, fd) {
                output += string;
            });

            result = build({base_folder: sample_repo_folder}, config_for_wp_multisite_plus);
            
            unhook();
        });

        it('should not throw an error', function(){
          result.should.be.true;
          output.should.not.match(/ERROR/);
        });
    });
    
    describe('[rebuild of existing version]\n $ pressup build '+ sample_repo_folder + '\n$ pressup build '+ sample_repo_folder , function(){
        before(function(){
            var result, output="";
            if (path.existsSync(sample_repo_folder)) {  }

            var unhook = test_helpers.grab_output(function(string, encoding, fd) {
                output += string;
            });

            result = build({base_folder: sample_repo_folder},config_of_custom_lib_site);
            result = build({base_folder: sample_repo_folder},config_of_custom_lib_site);

            unhook();
        });

        it('should create a httpdocs/test.domain.com/v42 folder', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42").should.be.true;
        });
    });
});

