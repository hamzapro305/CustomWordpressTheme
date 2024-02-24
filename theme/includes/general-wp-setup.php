<?php

// Remove blog posts from Menu since we are not doing a blog
function remove_posts_menu() {
  remove_menu_page('edit.php');
}
add_action('admin_menu', 'remove_posts_menu');

// Adds SVG support to media
function add_to_upload_mimes( $upload_mimes ) {
  $upload_mimes['svg'] = 'image/svg+xml';
  $upload_mimes['svgz'] = 'image/svg+xml';
  $upload_mimes['ico'] = 'image/x-icon';
  return $upload_mimes;

}
add_filter( 'upload_mimes', 'add_to_upload_mimes', 10, 1 ); 

// Register custom taxonomies
function add_custom_taxonomies() {

  /*register_taxonomy('type', ['recipe', 'product'], array(
    'hierarchical' => true,
    'labels' => array(
      'name' => _x( 'Types', 'taxonomy general name' ),
      'singular_name' => _x( 'Type', 'taxonomy singular name' ),
      'search_items' =>  __( 'Search Types' ),
      'all_items' => __( 'All Types' ),
      'parent_item' => __( 'Parent Type' ),
      'parent_item_colon' => __( 'Parent Type:' ),
      'edit_item' => __( 'Edit Type' ),
      'update_item' => __( 'Update Type' ),
      'add_new_item' => __( 'Add New Type' ),
      'new_item_name' => __( 'New Type Name' ),
      'menu_name' => __( 'Types' ),
    ),
    'rewrite' => array(
      'slug' => 'types',
      'with_front' => false, 
      'hierarchical' => true
    ),
  ));*/
}

add_action( 'init', 'add_custom_taxonomies', 0 );


// Register Post Types
function create_customContentTypes() {

  // Create Global Block content type
  register_post_type( 'globalblock',
    array(
      'labels' => array(
        'name' => __( 'Global Blocks' ),
        'singular_name' => __( 'Global Block' ),
        'all_items' => __('All Global Blocks'),
        'view_item' => __('View Global Block'),
        'add_new' => __('Add New Global Block'),
        'add_new_item' => __('Add Global Block'),
        'edit_item' => __('Edit Global Block'),
        'update_item' => __('Update Global Block'),
        'search_items' => __('Search Global Blocks')
      ),
      'menu_icon' => 'dashicons-admin-site',
      'public' => true,
      'publicly_queryable'  => false,
      'has_archive' => true,
      'rewrite' => array('slug' => 'globalblock'),
      'supports' => array( 'title'),
    )
  );
 

  add_theme_support( 'post-thumbnails' );  

}
add_action( 'init', 'create_customContentTypes' );

if( function_exists('acf_add_options_page') ) {
  
    // Adds Theme Options Page
    acf_add_options_page(array(
        'page_title'     => 'Theme General Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'        => false,
        'position' => '42',
    ));

    // Add Navigation Page
    acf_add_options_page(array(
      'page_title'     => 'Navigation',
      'menu_title'    => 'Navigation',
      'menu_slug'     => 'navigation',
      'capability'    => 'edit_posts',
      'redirect'        => false,
      'position' => '40',
      'icon_url' => 'dashicons-menu-alt',
      
  ));
}

function compareByName($a, $b) {
  return strcmp($a->name, $b->name);
}

function get_terms_by_post_type( $taxonomies, $post_types ) {

  global $wpdb;

  $query = $wpdb->prepare(
      "SELECT t.*, COUNT(*) from $wpdb->terms AS t
      INNER JOIN $wpdb->term_taxonomy AS tt ON t.term_id = tt.term_id
      INNER JOIN $wpdb->term_relationships AS r ON r.term_taxonomy_id = tt.term_taxonomy_id
      INNER JOIN $wpdb->posts AS p ON p.ID = r.object_id
      WHERE p.post_type IN('%s') AND tt.taxonomy IN('%s')
      GROUP BY t.term_id",
      join( "', '", $post_types ),
      join( "', '", $taxonomies )
  );

  $results = $wpdb->get_results( $query );

  usort($results, 'compareByName');

  return $results;

}

add_post_type_support( 'page', 'excerpt' );



function add_superandsubscript($buttons) {  
    array_push($buttons, 'superscript');
    array_push($buttons, 'subscript');
    return $buttons;
}
add_filter('mce_buttons', 'add_superandsubscript');
    

// disable xmlrpc
function remove_xmlrpc_methods( $methods ) {
    return array();
}
add_filter( 'xmlrpc_methods', 'remove_xmlrpc_methods' );


?>