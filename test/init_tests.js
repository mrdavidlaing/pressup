var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    init = require('../lib/init'),
    test_folder = 'test/tmp';

describe('init', function(){
    before(function(){
       if (path.existsSync(test_folder)) {  }
       init(test_folder);
    });

    it('should create a conf folder', function(){
      path.existsSync(test_folder + "/conf").should.be.true;
    });
    it('should create a conf/nginx folder', function(){
      path.existsSync(test_folder + "/conf/nginx").should.be.true;
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

