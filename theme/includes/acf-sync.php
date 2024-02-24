<?php

$acfFolder = '/config/acf-json';

add_filter('acf/settings/save_json', 'my_acf_json_save_point');
function my_acf_json_save_point($path) {
    global $acfFolder;
    $path = get_stylesheet_directory().$acfFolder;
    return $path;
}

add_filter('acf/settings/load_json', 'my_acf_json_load_point');
function my_acf_json_load_point($paths) {
    global $acfFolder;
    unset($paths[0]);
    $paths[] = get_stylesheet_directory().$acfFolder;
    return $paths;
}

?>