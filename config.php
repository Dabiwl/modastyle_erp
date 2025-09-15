<?php
// config.php - Configuración de conexión a la base de datos

// Evitar acceso directo al archivo
defined('_ACCESS') or die('Acceso restringido');

// Configuración de la base de datos
define('DB_HOST', 'localhost');     // Servidor de base de datos
define('DB_NAME', 'modastyle_erp'); // Nombre de la base de datos
define('DB_USER', 'root');          // Usuario de la base de datos
define('DB_PASS', '');              // Contraseña de la base de datos
define('DB_CHARSET', 'utf8mb4');    // Codificación de caracteres

// Zona horaria
date_default_timezone_set('America/Mexico_City');

// Clase de conexión a la base de datos
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    public $conn;

    // Obtener la conexión a la base de datos
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->exec("set names " . $this->charset);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            die("Error al conectar con la base de datos. Por favor, intente más tarde.");
        }

        return $this->conn;
    }
}

// Función para sanitizar datos de entrada
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    return $data;
}

// Headers para API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
?>