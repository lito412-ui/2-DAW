<?php
header('Content-Type: application/json');
$host     = "localhost";
$user     = "root";
$password = "";
$database = "cv_generator";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    
    $db = new mysqli($host, $user, $password, $database);
    if ($db->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Error de conexión']);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM historial_cv WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $db->error]);
    }
    
    $stmt->close();
    $db->close();
}
?>
