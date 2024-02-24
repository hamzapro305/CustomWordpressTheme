<?php 

$site_url = 'http://' . $_SERVER['SERVER_NAME'];
if (!strpos($site_url,'.local') && !strpos($site_url,'staging.') && !strpos($site_url,'dev.') ) {

    $gaID = get_field('google_analytics_id', 'option');
    if ($gaID && $gaID != '') {
        ?>
        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $gaID ?>"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '<?php echo $gaID; ?>');
        </script> 
    <?php }?>
<?php } else { ?>
    <!-- NO GA CODE INCLUDED ON DEV / STAGING ENVIRONMENT -->
<?php }