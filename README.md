# PressUp

is a wordpress install optimised for theme and plugin developers.

# Examples

Pressup must always be run from within your pressup installation root folder

## Get help

    /data/www/MyWordPressSites $ pressup --help

## Build mysite.com

    /data/www/MyWordPressSites $ pressup build --config conf/mysite.com.json
    
## Backup mysite.com's database

    /data/www/MyWordPressSites $ pressup db:backup --config conf/mysite.com.json

This creates mysqldump backup files in db/mysite_com

* Restore mysite.com's database

    /data/www/MyWordPressSites $ pressup db:restore --config conf/mysite.com.json

* Restore mysite.com's database over othersite.com's database

    /data/www/MyWordPressSites $ pressup db:restore target=conf/othersite.com.json --config conf/mysite.com.json
