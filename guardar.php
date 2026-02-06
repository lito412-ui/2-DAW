<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$host = 'localhost';
$db   = 'cv_generator';
$user = 'root';
$pass = 'changeme';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Manejo de errores por si no hay BBDD
    if (isset($_POST['accion'])) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión a BBDD: ' . $e->getMessage()]);
        exit;
    }
}

// Manejo de peticiones
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    if ($_POST['accion'] === 'guardar_db') {
        try {
            $stmt = $pdo->prepare("INSERT INTO historial_cv (nombre, apellido, email, telefono, titulo, linkedin, experiencia) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $_POST['nombre'] ?? '',
                $_POST['apellido'] ?? '',
                $_POST['email'] ?? '',
                $_POST['tel'] ?? '',
                $_POST['titulo'] ?? '',
                $_POST['linkedin'] ?? '',
                $_POST['experiencia'] ?? ''
            ]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
    }
}

// Listar historial para el frontend
if (isset($_GET['accion']) && $_GET['accion'] === 'listar') {
    try {
        $stmt = $pdo->query("SELECT * FROM historial_cv ORDER BY fecha_creacion DESC LIMIT 10");
        $historial = $stmt->fetchAll();
        echo json_encode($historial);
    } catch (Exception $e) {
        echo json_encode([]);
    }
    exit;
}

// Lógica descarga PDF
if (isset($_POST['Descargar'])) {

    exit;
}
?>
