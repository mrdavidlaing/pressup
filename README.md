# PressUp [![Build Status](https://secure.travis-ci.org/mrdavidlaing/pressup.png)](http://travis-ci.org/mrdavidlaing/pressup)

is a commandline tool to manage your WordPress git repository, and automate many operations common to managing 
a number of similar WordPress installations.

# Getting started

### Install PressUp

PressUp is a nodejs (v0.6+) based application.  It is written and tested on Ubuntu 11.10.

TODO - write verbose installation instructions for stable install (via npm), and bleeding edge install (via git)

### Create & initialise a git repository

* Create an empty git repository, eg: /data/www/MyWordPressSites
* Initialize this new repository as a pressup repository

    /data/www/MyWordPressSites $ pressup init .

* Initialize a new site profile

    /data/www/MyWordPressSites $ pressup init site mysite.com
    
* Build the site

    /data/www/MyWordPressSites $ pressup build --config conf/mysite.com.json
    
See [Getting started - step by step](https://github.com/mrdavidlaing/pressup/wiki/Getting-started---step-by-step) for a more complete example.

# Examples

Pressup must always be run from within your pressup installation root folder

### Get help

    /data/www/MyWordPressSites $ pressup --help

### Build mysite.com

    /data/www/MyWordPressSites $ pressup build --config conf/mysite.com.json
    
### Backup mysite.com's database

    /data/www/MyWordPressSites $ pressup db:backup --config conf/mysite.com.json

This creates mysqldump backup files in db/mysite_com

### Restore mysite.com's database

    /data/www/MyWordPressSites $ pressup db:restore --config conf/mysite.com.json

### Restore mysite.com's database over othersite.com's database

    /data/www/MyWordPressSites $ pressup db:restore target=conf/othersite.com.json --config conf/mysite.com.json

## TODO

### Add prompt for inputs

Options:

* https://github.com/visionmedia/commander.js
* https://github.com/flatiron/prompt