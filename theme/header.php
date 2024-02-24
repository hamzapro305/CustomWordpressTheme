<!DOCTYPE html>
<html id="no" <?php language_attributes(); ?>>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, user-scalable=0" />

	<?php include_once INCLUDES_DIR . 'google-tag-manager.php'; ?>
	<?php include_once INCLUDES_DIR . 'google-analytics.php'; ?>

	<!--FAVICON-->
	<link rel="icon" href="<?php echo get_stylesheet_directory_uri(); ?>/social/favicon.png" type="image/x-icon" />
	<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/social/favicon.png"
		type="image/x-icon" />
	<link rel="apple-touch-icon" sizes="180x180"
		href="<?php echo get_stylesheet_directory_uri(); ?>/social/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32"
		href="<?php echo get_stylesheet_directory_uri(); ?>/social/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16"
		href="<?php echo get_stylesheet_directory_uri(); ?>/social/favicon-16x16.png">
	<link rel="manifest" href="<?php echo get_stylesheet_directory_uri(); ?>/social/site.webmanifest">
	<link rel="mask-icon" href="<?php echo get_stylesheet_directory_uri(); ?>/social/safari-pinned-tab.svg"
		color="#000000">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">

	<?php wp_head(); ?>
	<meta name="author" content="<?php bloginfo('name'); ?>" />
	<script>
		window.ajaxUrl = "<?php echo admin_url('admin-ajax.php'); ?>";
	</script>
</head>

<body class="<?php

$fadeMenu = get_field("menu_fade", $post->ID);
if ($fadeMenu) {
	echo ' fadeMenu';
}

$current_user = wp_get_current_user();
if (user_can($current_user, 'administrator')) {
	echo ' adminbar';
}
?>">
	
	<div class="all">
		<?php require_once( get_template_directory() . '/navigation.php' ); ?>
		