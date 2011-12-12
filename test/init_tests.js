var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    init = require('../lib/init'),
    fs_helpers = require('../lib/fs_helpers'),
    test_folder = 'test/tmp/init_tests',
    util = require('util'),
    test_helpers = require('./test_helpers');

describe('init', function(){
    describe('$ pressup init ' + test_folder, function(){
        before(function(){
            fs_helpers.mkdir(test_folder, process.getuid(), process.getgid(), 0765);
            init(test_folder);
        });

        after(function(){
            fs_helpers.rmdirSyncRecursive(test_folder);
        });

        it('should create a conf folder', function(){
          path.existsSync(test_folder + "/conf").should.be.true;
        });
        it('should create a conf/nginx folder', function(){
          path.existsSync(test_folder + "/conf/nginx").should.be.true;
        });
        it('should create a httpdocs folder', function(){
          path.existsSync(test_folder + "/httpdocs").should.be.true;
        });
        it('should create a db folder', function(){
          path.existsSync(test_folder + "/db").should.be.true;
        });
        it('should create a lib folder', function(){
          path.existsSync(test_folder + "/lib").should.be.true;
        });
        it('should create a src folder', function(){
          path.existsSync(test_folder + "/lib").should.be.true;
        });
        it('should create a test folder', function(){
          path.existsSync(test_folder + "/test").should.be.true;
        });
    });

    describe('$ pressup init', function(){
        var init_result, output="";
        before(function(){
            var unhook = test_helpers.grab_output(function(string, encoding, fd) {
                output += string;
            });

            init_result = init();

            unhook();
        });

        it('should throw an error', function(){
          init_result.should.be.false;
        });
        it('should write an error message to std out', function(){
            output.should.include.string("ERROR");
        });
    });
});

