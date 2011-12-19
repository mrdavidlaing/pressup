var fs = require("fs"),
    path = require("path"),
    cli = require('cli'),
    _s = require('underscore.string'),
    exec = require('child_process').exec;

var fs_helpers = {
    /*
        Human readable file mode / permissions -  eg modeSync(/etc/passwwd') == "-rw-r--r--"
        From PHP sample: http://php.net/manual/en/function.fileperms.php
     */
    modeSync: function(path) {
        var stat = fs.statSync(path),
            mode = stat.mode,
            human_mode = "";

        if ((mode & 0xC000) == 0xC000) {
            human_mode = 's';  // Socket
        } else if ((mode & 0xA000) == 0xA000) {
            human_mode = 'l';  // Symbolic Link
        } else if ((mode & 0x8000) == 0x8000) {
            human_mode = '-';  // Regular
        } else if ((mode & 0x6000) == 0x6000) {
            human_mode = 'b';  // Block special
        } else if ((mode & 0x4000) == 0x4000) {
            human_mode = 'd';   // Directory
        } else if ((mode & 0x2000) == 0x2000) {
            human_mode = 'c';  // Character special
        } else if ((mode & 0x1000) == 0x1000) {
            human_mode = 'p';  // FIFO pipe
        } else {
            human_mode = 'u';  // Unknown
        }

        // Owner
        human_mode += ((mode & 0x0100) ? 'r' : '-');
        human_mode += ((mode & 0x0080) ? 'w' : '-');
        human_mode += ((mode & 0x0040) ?
                        ((mode & 0x0800) ? 's' : 'x' ) :
                        ((mode & 0x0800) ? 'S' : '-'));

        // Group
        human_mode += ((mode & 0x0020) ? 'r' : '-');
        human_mode += ((mode & 0x0010) ? 'w' : '-');
        human_mode += ((mode & 0x0008) ?
                        ((mode & 0x0400) ? 's' : 'x' ) :
                        ((mode & 0x0400) ? 'S' : '-'));

        // World
        human_mode += ((mode & 0x0004) ? 'r' : '-');
        human_mode += ((mode & 0x0002) ? 'w' : '-');
        human_mode += ((mode & 0x0001) ?
                        ((mode & 0x0200) ? 't' : 'x' ) :
                        ((mode & 0x0200) ? 'T' : '-'));


        return {
            decimal : mode,
            octal: mode.toString(8),
            binary: mode.toString(2),
            human: human_mode
        };
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

            if(currFile.isDirectory()) {
                try
                {
                   //if its a symlink, just unlink it
                   fs.unlinkSync(currFilePath);
                }
                catch(e) {
                   //otherwise, walk down a level and remove everything below it first
                   fs_helpers.rmdirSyncRecursive(currFilePath);
                }
            }
            else {  // Assume it's a file - perhaps a try/catch belongs here?
                fs.unlinkSync(currFilePath);
            }
        }

        return fs.rmdirSync(path);
    },
     /*
      (Re)Create a symlink
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
    copyFileSync: function(srcFile, destFile) {
      var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
      BUF_LENGTH = 64 * 1024;
      buff = new Buffer(BUF_LENGTH);
      fdr = fs.openSync(srcFile, 'r');
      fdw = fs.openSync(destFile, 'w');
      bytesRead = 1;
      pos = 0;
      while (bytesRead > 0) {
        bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        fs.writeSync(fdw, buff, 0, bytesRead);
        pos += bytesRead;
      }
      fs.closeSync(fdr);
      return fs.closeSync(fdw);
    },
    /*
      (Re) copy a file or folder recursively
     */
    copyRecursiveSync: function (source_path, target_path) {

        if (!path.existsSync(path.resolve(source_path))) {
            throw new Error("Source path doesn't exist: " + path.resolve(source_path));
        }
		
		if(fs.statSync(path.resolve(source_path)).isDirectory()) {
            if (!path.existsSync(path.resolve(target_path))) {
				fs.mkdirSync(path.resolve(target_path));
			}
        }

        if (fs.statSync(source_path).isDirectory()) {
           var files = fs.readdirSync(source_path);

           for(var i = 0; i < files.length; i++) {
               var source_realpath = source_path + "/" + files[i],
                   target_realpath = target_path + "/" + files[i];

               if (path.existsSync(target_realpath)) {
                    fs_helpers.rm(target_realpath);
               }

               if(fs.statSync(source_realpath).isDirectory()) {
                    fs.mkdirSync(target_realpath);
                    fs_helpers.copyRecursiveSync(source_realpath, target_realpath);    // Walk down a level
               }
               else
               {
                   fs_helpers.copyFileSync(source_realpath, target_realpath);
               }

           }
        }
        else
        {
           fs_helpers.copyFileSync(source_path, target_path);
        }
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
                fs.unlinkSync(target_path);
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

        fs.chownSync(resolved_path, user, group);
        fs.chmodSync(resolved_path, mode);

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