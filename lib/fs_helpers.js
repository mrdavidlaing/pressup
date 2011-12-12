var fs = require("fs"),
    path = require("path");

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

var fs_helpers = {
    isSymlinkDir: function(file_path) {
        //realpathSync("./a/relative/path") ==> /data/www/a/relative/path
        //realpathSync("./a/symlink") ==> /data/www/the/path  <- note how the resolved path no longer ends with the file_path
        return  fs.statSync(file_path).isDirectory()
            && !fs.realpathSync(file_path).endsWith(file_path);
    },
    /*  rmdirSyncRecursive("directory_path")
     *
     *  Recursively dives through folders and deletes everything.
     *  DOES NOT dive into symlinked folders
     *
     *  modified from wrench.rmdirSyncRecursive("directory_path");
     */
     rmdirSyncRecursive: function(path) {
        var files = fs.readdirSync(path),
            currDir = path;

        /*  Recursively delete everything in the subtree */
        for(var i = 0; i < files.length; i++) {
            var currFilePath = currDir + "/" + files[i];
            var currFile = fs.statSync(currFilePath);

            //just remove symlinked folders; don't walk down them and delete!
            if (this.isSymlinkDir(currFilePath)) {
                  fs.unlinkSync(currFilePath);
            }
            else if(currFile.isDirectory()) {
                fs_helpers.rmdirSyncRecursive(currFilePath);    // Walk down a level
            }
            else {  // Assume it's a file - perhaps a try/catch belongs here?
                fs.unlinkSync(currFilePath);
            }
        }

        return fs.rmdirSync(path);
    },
     /*
      Make a symlink (if it doesn't already exist)
     */
    symlink: function (target_path, source_path) {
        if (path.existsSync(target_path)) {
            fs.unlinkSync(target_path);
        }
        if (!path.existsSync(path.resolve(source_path))) {
            throw new Error("Link source path doesn't exist: " + path.resolve(source_path));
        }
        fs.symlinkSync(path.resolve(source_path), target_path);
    },
    /*
      Delete a file / folder (if it exists)
     */
    rm: function(target_path) {
        if (path.existsSync(target_path)) {
            var target_path_info = fs.statSync(target_path);
            if (target_path_info.isDirectory()) {
                fs.rmdirSync(target_path);
            } else {
               fs.rmSync(target_path);
            }
        }
    },
    /*
      Make a folder (if it doesn't already exist), and ensure its acls are as expected
     */
    mkdir: function(target_path, user, group, mode) {
        if (!path.existsSync(target_path)) {
            fs.mkdirSync(target_path);
        }
        fs.chownSync(target_path, user, group);
        fs.chmodSync(target_path, mode);
    },
     /*
      chown and chmod recursively (including symlink targets)
     */
    fixpermissionsRecursiveSync: function(target_path, user, group, mode) {
        var resolved_path = path.resolve(target_path),
            files = fs.readdirSync(resolved_path);

        for(var i = 0; i < files.length; i++) {
            var file_realpath = resolved_path + "/" + files[i];
            fs.chownSync(file_realpath, user, group);
            fs.chmodSync(file_realpath, mode);

           if(fs.statSync(file_realpath).isDirectory()) {
                fs_helpers.fixpermissionsRecursiveSync(file_realpath, user, group, mode);    // Walk down a level
            }
        }
    }
}

module.exports = fs_helpers;