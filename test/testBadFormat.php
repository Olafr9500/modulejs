<?php
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'response' => [
        'status' => 'error',
        'message' => 'Bad format'
    ],
    'data' => [
        'id' => '1',
        'name' => 'test',
        'email' => 'test@test.com',
        'password' => 'test',
        'created_at' => '2020-01-01 00:00:00',
        'updated_at' => '2020-01-01 00:00:00'
    ]
]);
