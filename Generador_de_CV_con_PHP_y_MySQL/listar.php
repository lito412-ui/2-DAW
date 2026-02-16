<?php
header('Content-Type: application/json');
$host     = "localhost";
$user     = "root";
$password = "";
$database = "cv_generator";

$db = new mysqli($host, $user, $password, $database);

if ($db->connect_error) {
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}

$result = $db->query("SELECT * FROM historial_cv ORDER BY id DESC");
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$db->close();
?>
