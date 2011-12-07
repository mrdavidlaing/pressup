<!DOCTYPE html>
	<head> 
		<meta charset="utf-8" />
		
		<!-- Title -->
		<title>Under Construction! | Site Name</title> 
		
		<!-- CSS -->
		<link rel="stylesheet" href="<?php echo get_bloginfo('stylesheet_url') ?>" type="text/css" media="screen" />
		
		<!-- Jquery and scripts are loaded at the bottom of the page -->
		
	</head>
	
    <body>
	
		<div id="wrapper">
		
			<!-- Header -->
			<div id="header">
				<h1><?php bloginfo('name'); ?></h1>
				<p><?php bloginfo('description'); ?></p>
			</div>
			
			<div id="content" class="clearfix">
			
				<!-- Main title -->
				<div id="title">
					<img src="<?php echo IMAGES_URL; ?>/helmet.png" alt="" />
					<h2>Sorry! Currently this site is</h2>
					<h3>Under Construction</h3>
				</div>
			
				
				<!-- Left-hand Column -->
<!--				<div id="left">
				
					<h4>Count Down</h4>
					<p>We're doing our best and we'll be back in:</p>
					<div id="countdown"></div>
					
				
				</div>
-->				
				<!-- Right-hand Column -->
				<div id="right">
					<?php
					if (function_exists('gravity_form'))
						gravity_form(1, true, true);
					?>
					
				</div>
				
			</div>
			
			<!-- Footer -->
			
			<div id="footer" class="clearfix">
				<p>Copyright 2010 - <?php bloginfo('name'); ?> - All rights reserved</p>
			</div>
			
		</div>
	
		<!-- Scripts -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
		<script>
			$(function () {

			
				// Inline Labels
				
				$('input[title]').each(function() {
			
					$(this).focus(function() {
							$(this).val('')
					});
					$(this).blur(function() {
						if($(this).val() === '') {
							$(this).val($(this).attr('title'))
						}
					});
				});
			});
		</script>
		
	</body>
	
</html>