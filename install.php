<?php
// install.php - Script de instalación de la base de datos

// Permitir acceso directo a este script
define('_ACCESS', true);

echo "<h2>Instalación de la Base de Datos ModaStyle ERP</h2>";

if (!file_exists('config.php')) {
    die("<p style='color: red;'>ERROR: No se encuentra el archivo config.php</p>");
}

require_once 'config.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    echo "<p style='color: green;'>✓ Conexión a MySQL exitosa</p>";
    
    // Leer el archivo SQL
    if (!file_exists('database.sql')) {
        die("<p style='color: red;'>ERROR: No se encuentra el archivo database.sql</p>");
    }
    
    $sql = file_get_contents('database.sql');
    
    // Ejecutar el script SQL
    $conn->exec($sql);
    
    echo "<p style='color: green;'>✓ Base de datos y tablas creadas correctamente</p>";
    echo "<p><a href='test-connection.php'>Verificar instalación</a></p>";
    echo "<p><a href='index.php'>Ir al sistema</a></p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>ERROR: " . $e->getMessage() . "</p>";
    
    // Intentar crear la base de datos si no existe
    if (strpos($e->getMessage(), "Unknown database") !== false) {
        echo "<p>Intentando crear la base de datos...</p>";
        
        try {
            // Conectar sin especificar base de datos
            $dsn = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
            $conn = new PDO($dsn, DB_USER, DB_PASS);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Crear la base de datos
            $conn->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $conn->exec("USE " . DB_NAME);
            
            // Leer y ejecutar el script SQL
            $sql = file_get_contents('database.sql');
            $conn->exec($sql);
            
            echo "<p style='color: green;'>✓ Base de datos y tablas creadas correctamente</p>";
            echo "<p><a href='test-connection.php'>Verificar instalación</a></p>";
            echo "<p><a href='index.php'>Ir al sistema</a></p>";
            
        } catch (PDOException $e2) {
            echo "<p style='color: red;'>ERROR al crear la base de datos: " . $e2->getMessage() . "</p>";
        }
    }
}
?>