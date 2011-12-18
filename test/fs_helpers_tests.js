var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    fs_helpers = require('../lib/fs_helpers'),
    base_folder = "./test/tmp/fs_helpers";

describe('fs_helpers', function(){

    describe('rmdirSyncRecursive - simple collection of folders', function(){
        before(function() {
            fs_helpers.mkdir(base_folder + "/simple_collection", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/simple_collection/1", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/simple_collection/2", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/simple_collection/1/3", process.getuid(), process.getgid(), 0765);

            fs_helpers.rmdirSyncRecursive(base_folder + "/simple_collection");
        });

        it('should delete everything', function(){
          path.existsSync(base_folder + "/simple_collection").should.be.false;
        });

        after(function() {
            fs_helpers.rm(base_folder + "/simple_collection/1/3");
            fs_helpers.rm(base_folder + "/simple_collection/1");
            fs_helpers.rm(base_folder + "/simple_collection/2");
            fs_helpers.rm(base_folder + "/simple_collection");
        });
    });

    describe('rmdirSyncRecursive - collection of folders & symlinked folders', function(){
        before(function() {
            fs_helpers.mkdir(base_folder + "/simple_collection", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/simple_collection/1", process.getuid(), process.getgid(), 0765);

            fs_helpers.mkdir(base_folder + "/collection", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/collection/1", process.getuid(), process.getgid(), 0765);
            fs_helpers.symlink(base_folder + "/collection/symlink_to_simple_collection", base_folder + "/simple_collection");

            fs_helpers.rmdirSyncRecursive(base_folder + "/collection");
        });

        it('should delete everything in collection', function(){
          path.existsSync(base_folder + "/collection").should.be.false;
        });
        it('should not delete below the symlink', function(){
          path.existsSync(base_folder + "/simple_collection").should.be.true;
          path.existsSync(base_folder + "/simple_collection/1").should.be.true;
        });

        after(function() {
            fs_helpers.rm(base_folder + "/collection/symlink_to_simple_collection");
            fs_helpers.rm(base_folder + "/collection/1");
            fs_helpers.rm(base_folder + "/collection");

            fs_helpers.rm(base_folder + "/simple_collection/1");
            fs_helpers.rm(base_folder + "/simple_collection");
        });
    });

     describe('copyRecursiveSync should recursively copy everything below a folder', function(){
       before(function() {
            fs_helpers.mkdir(base_folder + "/a_collection", process.getuid(), process.getgid(), 0765);
            fs_helpers.mkdir(base_folder + "/a_collection/1", process.getuid(), process.getgid(), 0765);
            fs.writeFileSync(base_folder + "/a_collection/1/a_file.txt", "Content");
            fs_helpers.mkdir(base_folder + "/copy_of_a_folder", process.getuid(), process.getgid(), 0765);

            fs_helpers.copyRecursiveSync(base_folder + "/a_collection", base_folder + "/copy_of_a_folder");
        });

        it('should copy everything', function(){
          path.existsSync(base_folder + "/copy_of_a_folder/1").should.be.true;
          path.existsSync(base_folder + "/copy_of_a_folder/1/a_file.txt").should.be.true;
        });

        after(function() {
            fs_helpers.rmdirSyncRecursive(base_folder + "/a_collection");
            fs_helpers.rmdirSyncRecursive(base_folder + "/copy_of_a_folder");
        });
    });
});

