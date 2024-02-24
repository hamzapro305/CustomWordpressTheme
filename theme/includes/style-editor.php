<?php 

// Add styles to admin wysiwyg
function wysiwyg_style_setup() {
    add_editor_style( get_template_directory_uri() . '/editor-style.css' );
}
add_action( 'after_setup_theme', 'wysiwyg_style_setup' );

// Remove the default format dropdown
function remove_default_format_select( $buttons ) {
  $remove = array( 'formatselect' );
  return array_diff( $buttons, $remove );
}
add_filter( 'mce_buttons', 'remove_default_format_select' );


// Callback function to insert 'styleselect' into the $buttons array
function styleselect_dropdown( $buttons ) {
  array_unshift( $buttons, 'styleselect' );
  return $buttons;
}
add_filter( 'mce_buttons', 'styleselect_dropdown' );


function styleselect_formats( $init_array ) {  
  // Define the style_formats array
  $style_formats = array(
        array(
            'title' => 'Normal Text',
            'block' => 'p'
        ),
        array(
            'title' => 'Headline 1',
            'block' => 'h1',
            ),
        array(
            'title' => 'Headline 2',
            'block' => 'h2'
            ),
        array(
            'title' => 'Headline 3',
            'block' => 'h3'
            ),
        array(
            'title' => 'Headline 4',
            'block' => 'h4'
            ),
        array(
            'title' => 'Headline 5',
            'block' => 'h5'
        ),
        array(
            'title' => 'Headline 6',
            'block' => 'h6'
        ),
        array(
            'title' => 'Button',
            'block' => 'button'
        )
      );
  $init_array['style_formats'] = json_encode( $style_formats );  

  return $init_array;  

} 
add_filter( 'tiny_mce_before_init', 'styleselect_formats' );
