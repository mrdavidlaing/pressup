<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

 
 // ** MySQL settings - You can get this info from your web host ** //
$install_path = dirname(__FILE__);

if (strstr($install_path,"www\City Index\CIAPI.Wordpress"))
{
	
	define('DB_NAME', 'ciapjs_local');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');	

}
else
if (strstr($install_path,"ciapiwordpress.ryanholder.com"))
{
	define('DB_NAME', 'ciapwordpress_production');
	define('DB_USER', 'ryanholder');
	define('DB_PASSWORD', 'holderryan');
}
else
if (strstr($install_path,"mrdavidlaing"))
{
	define('DB_NAME', 'ciapi_wordpress');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');
}
else
{
	die("Unrecognised installation location: $install_path - unsure which settings to load.  Amend config file.");
}

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');


/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'cvC1UQh;|I|=[4K|_XAmEf6_Xe?8x-`s&P3^-]+|vcOM-br|-?3X+;uxko;=a+kL');
define('SECURE_AUTH_KEY',  'K+5=Zf2JQ&+h3TZh{3N<d+;9-jk@aORg?T&wlch9Ow/#6=KWA}7CMW,yn g5t>bp');
define('LOGGED_IN_KEY',    '/w<xy<(|/[fD+@w}`v*#@P<:j1-=-*Mr0F;2FKxnU]i3S!-71j<u}cW(k+G!-<<2');
define('NONCE_KEY',        '73ki?)P~$lrj%nf9XIx!36);L-Z|CvQ*BSA@kwd:0:=mD@cLy+Xos_CJN*5.>G4e');
define('AUTH_SALT',        'ikM3Ph:!c]+[w55GnTlf6ez8.C#B<LqcVcG;C#n^VbwKt@|^d~+@Q#Rj|.xhZdfI');
define('SECURE_AUTH_SALT', 'v*Zjh)|IPm-~yFj/A o.rLezz/!r${||+st5oMPU|~)at+^CaBHo7O-OjwO-+X7:');
define('LOGGED_IN_SALT',   '!F)-L`g<d^SrQDt~=k1e?w6|d}2 iv$}#E<1Ua<J!.bEO=zZ.}MirH6avw<1.2u+');
define('NONCE_SALT',       '?lL4xN<m,T}6hbm rbMMIGLK|g8wgr|jCiC=mQj7p$z(%*hqI`gTwq$7XDHVyoUz');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
