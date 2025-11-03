<?php
// Allow cross-origin requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Minecraft server details
$server_ip = '172.93.100.79';
$server_port = 2240;

// Function to query Minecraft server
function queryMinecraftServer($ip, $port) {
    $socket = @fsockopen('udp://'.$ip, $port, $errno, $errstr, 3);
    
    if(!$socket) {
        return [
            'online' => false,
            'players' => 0
        ];
    }
    
    // Set timeout
    stream_set_timeout($socket, 3);
    
    // Pack data to send
    $command = pack('cccca*n', 0xFE, 0xFD, 9, 0, "", $port);
    
    fwrite($socket, $command);
    
    // Read response
    $response = fread($socket, 2048);
    fclose($socket);
    
    if(!$response) {
        return [
            'online' => false,
            'players' => 0
        ];
    }
    
    // Try simpler connection test if query fails
    $socket = @fsockopen($ip, $port, $errno, $errstr, 3);
    if($socket) {
        fclose($socket);
        return [
            'online' => true,
            'players' => 1 // We don't know how many, but at least the server is up
        ];
    }
    
    return [
        'online' => false,
        'players' => 0
    ];
}

// Try external API first (as a fallback)
$api_response = @file_get_contents("https://api.mcsrvstat.us/2/$server_ip:$server_port");
if($api_response) {
    $data = json_decode($api_response, true);
    if($data && isset($data['online']) && $data['online'] === true) {
        echo json_encode([
            'online' => true,
            'players' => $data['players']['online'] ?? 1,
            'source' => 'api'
        ]);
        exit;
    }
}

// If API fails, query the server directly
$result = queryMinecraftServer($server_ip, $server_port);
$result['source'] = 'direct';
echo json_encode($result);
?>