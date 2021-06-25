<?php
include 'constants.php';

// 1. check whether the data folder exists, otherwise, create it:
if ( ! file_exists( DATA_PATH ) ) {
    mkdir( DATA_PATH, 0755 );
}

// 2. display the web interface:

?>
<!DOCTYPE html>
<html>
    <head>
        <title>PW Manager</title>
        <link rel="stylesheet" href="styles.css">
        
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="manifest" href="/favicon/site.webmanifest">
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">
    </head>
    <body>
        <!-- <script src="lib/cryptojs-core.min.js"></script> -->
        <script src="lib/crypto.aes.js"></script>

        <!-- <script src="lib/cryptojs-aes.min.js"></script> -->
        <script src="main.js"></script>
    </body>
</html>