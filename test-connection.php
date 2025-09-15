<?php
// test-connection.php - Verificar conexión a la base de datos

echo "<h2>Verificación de conexión a la base de datos</h2>";

// Intentar cargar la configuración
if (!file_exists('config.php')) {
    die("<p style='color: red;'>ERROR: No se encuentra el archivo config.php</p>");
}

// Definir la constante antes de incluir config.php para evitar el error de acceso restringido
define('_ACCESS', true);

require_once 'config.php';

echo "<p>Archivo config.php cargado correctamente</p>";

// Verificar constantes definidas
echo "<h3>Constantes de configuración:</h3>";
echo "<ul>";
echo "<li>DB_HOST: " . (defined('DB_HOST') ? DB_HOST : '<span style="color: red;">NO DEFINIDO</span>') . "</li>";
echo "<li>DB_NAME: " . (defined('DB_NAME') ? DB_NAME : '<span style="color: red;">NO DEFINIDO</span>') . "</li>";
echo "<li>DB_USER: " . (defined('DB_USER') ? DB_USER : '<span style="color: red;">NO DEFINIDO</span>') . "</li>";
echo "<li>DB_PASS: " . (defined('DB_PASS') ? DB_PASS : '<span style="color: red;">NO DEFINIDO</span>') . "</li>";
echo "</ul>";

// Intentar conectar
try {
    $database = new Database();
    $conn = $database->getConnection();
    
    echo "<p style='color: green;'>✓ CONEXIÓN EXITOSA a la base de datos</p>";
    
    // Verificar si la tabla de clientes existe
    $query = "SHOW TABLES LIKE 'clientes'";
    $stmt = $conn->query($query);
    
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ La tabla 'clientes' existe</p>";
        
        // Contar clientes
        $query = "SELECT COUNT(*) as total FROM clientes";
        $stmt = $conn->query($query);
        $result = $stmt->fetch();
        
        echo "<p>Número de clientes en la base de datos: <strong>" . $result['total'] . "</strong></p>";
        
        // Mostrar algunos clientes
        $query = "SELECT id, nombre, email FROM clientes LIMIT 5";
        $stmt = $conn->query($query);
        
        echo "<h3>Algunos clientes:</h3>";
        echo "<ul>";
        while ($row = $stmt->fetch()) {
            echo "<li>" . $row['id'] . " - " . $row['nombre'] . " (" . $row['email'] . ")</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>✗ La tabla 'clientes' NO existe</p>";
        echo "<p><a href='install.php'>¿Quieres crear la base de datos y tablas?</a></p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>✗ ERROR de conexión: " . $e->getMessage() . "</p>";
    echo "<p>Soluciones posibles:</p>";
    echo "<ul>";
    echo "<li>Verifica que MySQL esté ejecutándose</li>";
    echo "<li>Revisa las credenciales en config.php</li>";
    echo "<li>Asegúrate de que la base de datos '" . DB_NAME . "' existe</li>";
    echo "</ul>";
}

// Información del servidor
echo "<h3>Información del servidor:</h3>";
echo "<ul>";
echo "<li>PHP version: " . phpversion() . "</li>";
echo "<li>Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li>Directorio actual: " . __DIR__ . "</li>";
echo "</ul>";

// Probar la API
echo "<h3>Probar API:</h3>";
echo "<p><a href='api/clientes.php' target='_blank'>Probar API de clientes directamente</a></p>";
?>