<?php

// 1. check whether the data folder exists.
//  otherwise, create it.

// 2. display the web interface.

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
        <form class="login">
            <h1>What's the secret code, <nobr>Mr. Bond</nobr>?</h1>
            <p>
                <input type="password" name="master_password" placeholder="">
            </p>
            <p>
                <input type="submit" value="Enter">
            </p>
        </form>
    </body>
</html>