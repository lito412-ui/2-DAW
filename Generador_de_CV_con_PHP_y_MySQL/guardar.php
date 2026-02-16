<?php
error_reporting(0);
ob_start();

if (isset($_POST['Descargar'])) {
    
    $host     = "localhost";
    $user     = "root";
    $password = "";
    $database = "cv_lito";

    $db = new mysqli($host, $user, $password, $database);

    if ($db->connect_error) {
        die("Error de conexión a la DB: " . $db->connect_error);
    }

    $nombre      = $db->real_escape_string($_POST['nombre']      ?? 'Sin_Nombre');
    $apellido    = $db->real_escape_string($_POST['apellido']    ?? '');
    $email       = $db->real_escape_string($_POST['email']       ?? '');
    $telefono    = $db->real_escape_string($_POST['tel']    ?? '');
    $titulo      = $db->real_escape_string($_POST['titulo']      ?? '');
    $linkedin    = $db->real_escape_string($_POST['linkedin']    ?? '');
    $experiencia = $db->real_escape_string($_POST['experiencia'] ?? '');

    $query = "INSERT INTO historial_cv (nombre, apellido, email, telefono, titulo, linkedin, experiencia) 
              VALUES ('$nombre', '$apellido', '$email', '$telefono', '$titulo', '$linkedin', '$experiencia')";
    
    $db->query($query);
    $db->close();

    $nombre_fichero = preg_replace('/[^A-Za-z0-9_\-]/', '', str_replace(' ', '_', $nombre));
    $filename = "CV_" . $nombre_fichero . ".html";
    $temp_file = 'temp_cv_' . uniqid() . '.html';

    $h_nombre      = htmlspecialchars($nombre);
    $h_apellido    = htmlspecialchars($apellido);
    $h_titulo      = htmlspecialchars($titulo);
    $h_experiencia = nl2br(htmlspecialchars($experiencia));

    $html_cv = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>CV - $h_nombre</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; border: 1px solid #eee; padding: 30px; }
            h1 { color: #137fec; margin-bottom: 5px; text-transform: uppercase; }
            h3 { color: #666; margin-top: 0; font-weight: 300; }
            .contacto { font-size: 0.9em; color: #555; margin-bottom: 20px; }
            .seccion { margin-top: 30px; }
            h4 { border-bottom: 2px solid #137fec; padding-bottom: 5px; color: #137fec; margin-bottom: 10px; }
            .no-print { background: #fff3cd; padding: 15px; margin-bottom: 20px; border: 1px solid #ffeeba; text-align: center; }
            @media print { .no-print { display: none; } body { margin: 0; border: none; } }
        </style>
    </head>
    <body>
        <div class='no-print'>
            Nota: Se ha abierto el diálogo de impresión. Selecciona <b>'Guardar como PDF'</b>.<br>
            <small>Si no aparece, presiona Ctrl + P</small>
        </div>

        <h1>$h_nombre $h_apellido</h1>
        <h3>$h_titulo</h3>
        
        <div class='contacto'>
            Email: " . htmlspecialchars($email) . " | Tel: " . htmlspecialchars($telefono) . " <br>
            LinkedIn: " . htmlspecialchars($linkedin) . "
        </div>

        <div class='seccion'>
            <h4>Experiencia Profesional</h4>
            <p>$h_experiencia</p>
        </div>

        <script>window.onload = function() { window.print(); }</script> 
    </body>
    </html>";

    file_put_contents($temp_file, $html_cv);

    if (is_file($temp_file)) {
        if (ob_get_level()) ob_end_clean();

        header("Content-Description: File Transfer");
        header("Content-Type: text/html; charset=utf-8");
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Length: " . filesize($temp_file));
        
        readfile($temp_file);
        
        unlink($temp_file);
        exit;
    }
}
?>