<?php
// api/clientes.php - Maneja operaciones CRUD para clientes

// Permitir acceso desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Definir constante para evitar el error de acceso restringido
define('_ACCESS', true);

// Incluir configuración de base de datos
require_once '../config.php';

// Obtener método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Procesar según el método
switch ($method) {
    case 'GET':
        // Obtener clientes
        if (isset($_GET['id'])) {
            getCliente($_GET['id']);
        } else {
            getClientes();
        }
        break;
    case 'POST':
        createCliente();
        break;
    case 'PUT':
        updateCliente();
        break;
    case 'DELETE':
        deleteCliente();
        break;
    default:
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}

// Función para obtener todos los clientes
function getClientes() {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT * FROM clientes ORDER BY nombre";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $clientes = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $clientes[] = $row;
    }
    
    echo json_encode($clientes);
}

// Función para obtener un cliente específico
function getCliente($id) {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT * FROM clientes WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($cliente);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Cliente no encontrado."));
    }
}

// Función para crear un nuevo cliente
function createCliente() {
    $database = new Database();
    $db = $database->getConnection();
    
    // Obtener datos del POST
    $data = json_decode(file_get_contents("php://input"));
    
    // Validar datos requeridos
    if (!empty($data->nombre) && !empty($data->email)) {
        // Sanitizar datos
        $nombre = sanitizeInput($data->nombre);
        $email = sanitizeInput($data->email);
        $telefono = !empty($data->telefono) ? sanitizeInput($data->telefono) : NULL;
        $direccion = !empty($data->direccion) ? sanitizeInput($data->direccion) : NULL;
        $fecha_nacimiento = !empty($data->fecha_nacimiento) ? sanitizeInput($data->fecha_nacimiento) : NULL;
        $genero = !empty($data->genero) ? sanitizeInput($data->genero) : NULL;
        
        // Insertar en la base de datos
        $query = "INSERT INTO clientes (nombre, email, telefono, direccion, fecha_nacimiento, genero) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$nombre, $email, $telefono, $direccion, $fecha_nacimiento, $genero])) {
            http_response_code(201);
            echo json_encode(array("message" => "Cliente creado correctamente.", "id" => $db->lastInsertId()));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear el cliente."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos. Se requieren nombre y email."));
    }
}

// Función para actualizar un cliente
function updateCliente() {
    $database = new Database();
    $db = $database->getConnection();
    
    // Obtener datos del PUT
    $data = json_decode(file_get_contents("php://input"));
    
    // Obtener ID desde la URL
    $id = isset($_GET['id']) ? $_GET['id'] : die();
    
    // Validar datos requeridos
    if (!empty($data->nombre) && !empty($data->email)) {
        // Sanitizar datos
        $nombre = sanitizeInput($data->nombre);
        $email = sanitizeInput($data->email);
        $telefono = !empty($data->telefono) ? sanitizeInput($data->telefono) : NULL;
        $direccion = !empty($data->direccion) ? sanitizeInput($data->direccion) : NULL;
        $fecha_nacimiento = !empty($data->fecha_nacimiento) ? sanitizeInput($data->fecha_nacimiento) : NULL;
        $genero = !empty($data->genero) ? sanitizeInput($data->genero) : NULL;
        $estado = !empty($data->estado) ? sanitizeInput($data->estado) : 'Activo';
        
        // Actualizar en la base de datos
        $query = "UPDATE clientes 
                  SET nombre = ?, email = ?, telefono = ?, direccion = ?, fecha_nacimiento = ?, genero = ?, estado = ?
                  WHERE id = ?";
        $stmt = $db->prepare($query);
        
        if ($stmt->execute([$nombre, $email, $telefono, $direccion, $fecha_nacimiento, $genero, $estado, $id])) {
            http_response_code(200);
            echo json_encode(array("message" => "Cliente actualizado correctamente."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al actualizar el cliente."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Datos incompletos. Se requieren nombre y email."));
    }
}

// Función para eliminar un cliente
function deleteCliente() {
    $database = new Database();
    $db = $database->getConnection();
    
    // Obtener ID desde la URL
    $id = isset($_GET['id']) ? $_GET['id'] : die();
    
    // Eliminar de la base de datos
    $query = "DELETE FROM clientes WHERE id = ?";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute([$id])) {
        http_response_code(200);
        echo json_encode(array("message" => "Cliente eliminado correctamente."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Error al eliminar el cliente."));
    }
}
?>