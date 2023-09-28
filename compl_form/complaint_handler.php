<?php
session_start();

// Create MySQL connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "if21010";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function handleFileUpload($fieldName){
    if (isset($_FILES[$fieldName]) && $_FILES[$fieldName]['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES[$fieldName]['tmp_name'];
        $fileName = $_FILES[$fieldName]['name'];
        $fileType = $_FILES[$fieldName]['type'];

        // Choose the destination folder based on the file type
        $destinationFolder = '';
        if (strpos($fileType, 'image/') === 0) {
            $destinationFolder = 'uploads/images/';
        } elseif (strpos($fileType, 'video/') === 0) {
            $destinationFolder = 'uploads/videos/';
        } elseif (strpos($fileType, 'audio/') === 0) {
            $destinationFolder = 'uploads/audios/';
        } else {
            $destinationFolder = 'uploads/documents/';
        }

        // Create the destination folder if it doesn't exist
        if (!file_exists($destinationFolder)) {
            mkdir($destinationFolder, 0755, true);
        }

        $fileDestination = $destinationFolder . $fileName;

        if (move_uploaded_file($fileTmpPath, $fileDestination)) {
            return $fileDestination;
        } else {
            // Return an error message if file upload fails
            return "Error uploading $fieldName.";
        }
    }
    return null;
}

function verifyCaptcha($userInput) {
    if (isset($_SESSION['captcha']) && !empty($userInput)) {
        $storedCaptcha = $_SESSION['captcha'];
        return $userInput === $storedCaptcha;
    }
    return false;
}

function generateComplaintNumber($dept, $committee) {
    $currentYear = date('Y');
    $randomDigits = str_pad(mt_rand(0, 99999), 5, '0', STR_PAD_LEFT);
    return strtoupper("$dept/$committee/$currentYear/$randomDigits");
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Validate and sanitize user input here (implement your validation logic)
    $dept = isset($_POST["dept"]) ? sanitizeInput($_POST["dept"]) : "";
    $year = isset($_POST["year"]) ? sanitizeInput($_POST["year"]) : "";
    $committee = isset($_POST["cmite"]) ? sanitizeInput($_POST["cmite"]) : "";
    $incdnt_dscrptin = isset($_POST["incdnt_dscrptin"]) ? sanitizeInput($_POST["incdnt_dscrptin"]) : "";
    $indiv_inv = isset($_POST["indiv_inv"]) ? sanitizeInput($_POST["indiv_inv"]) : "";
    $date = isset($_POST["date"]) ? sanitizeInput($_POST["date"]) : "";
    $time = isset($_POST["time"]) ? sanitizeInput($_POST["time"]) : "";
    $location = isset($_POST["location"]) ? sanitizeInput($_POST["location"]) : "";
    $add_dtls = isset($_POST["add_dtls"]) ? sanitizeInput($_POST["add_dtls"]) : "";

    // CAPTCHA verification
    $captchaValue = isset($_POST['captcha']) ? $_POST['captcha'] : '';
    if (!verifyCaptcha($captchaValue)) {
        // CAPTCHA verification failed
        $response = array('success' => false, 'message' => 'Incorrect CAPTCHA! Please try again.');
        
        echo json_encode($response);
        unset($_SESSION['captcha']);
        exit; // Stop further execution
    }

    // Generate complaint number
    $complaint_number = generateComplaintNumber($dept, $committee);

    // Handle file uploads and get the file paths
    $file_upload = handleFileUpload('file_upload');

    // Prepare and execute the SQL statement using prepared statements
   

    $stmt = $conn->prepare("INSERT INTO complaint2 (dept, year, committee, incdnt_dscrptin, indiv_inv, date, time, location, add_dtls, file_upload, timestamp, complaint_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)");
    if ($stmt) {
        $stmt->bind_param(
            "sssssssssss",
            $dept,
            $year,
            $committee,
            $incdnt_dscrptin,
            $indiv_inv,
            $date,
            $time,
            $location,
            $add_dtls,
            $file_upload,
            $complaint_number
        );

        if ($stmt->execute()) {
            $stmt->close();
            $conn->close();

            // Show success message as a JSON response
            header('Content-Type: application/json');
            // After successfully submitting the complaint, include the complaint number in the success response
            $response = array('success' => true, 'message' => 'Complaint submitted successfully!', 'complaintNumber' => $complaint_number);
            echo json_encode($response);
            unset($_SESSION['captcha']);
            exit;
            
            // Make sure to exit after sending the JSON response
        } else {
            // Show error message as a JSON response
            $response = array('success' => false, 'message' => 'Error executing query.');
            echo json_encode($response);
            unset($_SESSION['captcha']);
            exit;
        }
    } else {
        // Show error message as a JSON response
        $response = array('success' => false, 'message' => 'Error preparing statement.');
        echo json_encode($response);
        exit;
    }
}
?>
