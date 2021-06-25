<?php
include 'constants.php';

function get_file_path($filename) {
    return DATA_PATH.DS.$filename.'.dat';
}

if ( !empty($_GET)) {
    switch ($_GET['action']) {
        case 'update':
            // Get data:
            $request_body = file_get_contents('php://input');
            $posted = json_decode($request_body);
            $filename = $posted->filename;
            $filecontent = $posted->encrypteddata;

            // Write to file:
            $filepath = get_file_path($filename);
            $bytes_written = file_put_contents($filepath, $filecontent);

            // Respond to request:
            header('Content-Type: application/json');
            echo json_encode([
                'file_path' => $filepath,
                'bytes_written' => $bytes_written
            ]);
            break;

        case 'list':
            $files = glob(DATA_PATH . DS . '*.dat');
            header('Content-Type: application/json');
            echo json_encode($files);
            break;
        
        case 'get':
            $filename = $_GET['filename'];
            $filepath = get_file_path($filename);
            $content = file_get_contents($filepath);
            header('Content-Type: application/json');
            echo json_encode([
                'file_path' => $filepath,
                'file_content' => $content
            ]);
        
        default:
            # code...
            break;
    }
}
