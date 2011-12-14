var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    global_config = require('../lib/global_config'),
    build = require('../lib/build'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('build', function(){
    describe('[a new versioned build]\n $ pressup build ' + sample_repo_folder, function(){
        var result = false, output="",
            file_with_bad_permissions = "wp-app.php";
        before(function() {

            fs.chownSync(sample_repo_folder + "/lib/wordpress/wordpress-3.3-RC2/" + file_with_bad_permissions, process.getuid(), process.getgid());  //break ownership
            fs.chmodSync(sample_repo_folder + "/lib/wordpress/wordpress-3.3-RC2/" + file_with_bad_permissions, 0600);  //break permissions

            result = build({base_folder: sample_repo_folder},{
                fqdn: "test.domain.com",
                version: 42,
                wordpress: "lib/wordpress/wordpress-3.3-RC2",
                plugins: {},
                themes: {}
            });
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
        it('should fix the file permissions of linked files', function(){
            var fileStats = fs.statSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/" + file_with_bad_permissions);

            fileStats.uid.should.equal(global_config.built.uid);
            fileStats.gid.should.equal(global_config.built.gid);
            //TODO - how do I check file permissions? fileStats.mode.should.equal(0755);
        });
        it('should set the permissions on the folders correctly', function(){
            fs.statSync(sample_repo_folder + "/httpdocs").isDirectory().should.be.true;
            fs.statSync(sample_repo_folder + "/httpdocs/test.domain.com/v42/wp-admin").gid.should.equal(global_config.built.gid);
        });
    });
    describe('[rebuild of existing version]\n $ pressup build '+ sample_repo_folder + '\n$ pressup build '+ sample_repo_folder , function(){
        before(function(){
            var result, output="";
            if (path.existsSync(sample_repo_folder)) {  }

            var unhook = test_helpers.grab_output(function(string, encoding, fd) {
                output += string;
            });

            result = build({base_folder: sample_repo_folder},{
                fqdn: "test.domain.com",
                version: 42,
                wordpress: "lib/wordpress/wordpress-3.3-RC2",
                plugins: {},
                themes: {}
            });

            result = build({base_folder: sample_repo_folder},{
                fqdn: "test.domain.com",
                version: 42,
                wordpress: "lib/wordpress/wordpress-3.3-RC2",
                plugins: {},
                themes: {}
            });

            unhook();
        });

        it('should create a httpdocs/test.domain.com/v42 folder', function(){
          path.existsSync(sample_repo_folder + "/httpdocs/test.domain.com/v42").should.be.true;
        });
    });
});

