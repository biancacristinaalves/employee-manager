<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$newEmployee = json_decode($input, true);

// Basic validation
if (!isset($newEmployee['empFirstname'], $newEmployee['empLastname'], $newEmployee['empSalary'], $newEmployee['empLevel'])) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$file = 'employees.json';

// Ensure file exists and has valid JSON
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$employees = json_decode(file_get_contents($file), true);

// Generate new ID
$newEmployee['empId'] = !empty($employees) ? end($employees)['empId'] + 1 : 1;

// Add new employee and save
$employees[] = $newEmployee;

if (file_put_contents($file, json_encode($employees, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to save data"]);
}
?>
