var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    build = require('../lib/build'),
    sample_repo_folder = 'test/sample_repo',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('build', function(){
    describe('[a new versioned build]\n $ pressup build ' + sample_repo_folder, function(){
        var result = false, output="";
        before(function() {
            debugger;
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
        it('should set the permissions on the folders correctly', function(){
            fs.statSync(sample_repo_folder + "/httpdocs").isDirectory().should.be.true;
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

