
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

LOCK TABLES `wp_usermeta` WRITE;
/*!40000 ALTER TABLE `wp_usermeta` DISABLE KEYS */;
REPLACE INTO `wp_usermeta` VALUES (1,1,'first_name','');
REPLACE INTO `wp_usermeta` VALUES (2,1,'last_name','');
REPLACE INTO `wp_usermeta` VALUES (3,1,'nickname','admin');
REPLACE INTO `wp_usermeta` VALUES (4,1,'description','');
REPLACE INTO `wp_usermeta` VALUES (5,1,'rich_editing','true');
REPLACE INTO `wp_usermeta` VALUES (6,1,'comment_shortcuts','false');
REPLACE INTO `wp_usermeta` VALUES (7,1,'admin_color','fresh');
REPLACE INTO `wp_usermeta` VALUES (8,1,'use_ssl','0');
REPLACE INTO `wp_usermeta` VALUES (9,1,'show_admin_bar_front','true');
REPLACE INTO `wp_usermeta` VALUES (10,1,'wp_capabilities','a:1:{s:13:\"administrator\";s:1:\"1\";}');
REPLACE INTO `wp_usermeta` VALUES (11,1,'wp_user_level','10');
REPLACE INTO `wp_usermeta` VALUES (12,1,'dismissed_wp_pointers','wp330_toolbar,wp330_media_uploader,wp330_saving_widgets');
REPLACE INTO `wp_usermeta` VALUES (13,1,'show_welcome_panel','0');
REPLACE INTO `wp_usermeta` VALUES (14,1,'wp_dashboard_quick_press_last_post_id','3');
REPLACE INTO `wp_usermeta` VALUES (15,1,'closedpostboxes_post','a:0:{}');
REPLACE INTO `wp_usermeta` VALUES (16,1,'metaboxhidden_post','a:7:{i:0;s:11:\"postexcerpt\";i:1;s:13:\"trackbacksdiv\";i:2;s:10:\"postcustom\";i:3;s:16:\"commentstatusdiv\";i:4;s:11:\"commentsdiv\";i:5;s:7:\"slugdiv\";i:6;s:9:\"authordiv\";}');
/*!40000 ALTER TABLE `wp_usermeta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

