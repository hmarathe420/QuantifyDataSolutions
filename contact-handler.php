<?php
/**
 * Quantify Data Solutions - Contact Form Handler
 *
 * Receives the project inquiry form and emails it to
 * info@quantifydatasolutions.in.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

function clean_text(string $value, int $maxLength = 2000): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\0"], '', $value);
    return mb_substr($value, 0, $maxLength);
}

$fullName = clean_text((string)($_POST['full_name'] ?? ''), 120);
$company = clean_text((string)($_POST['company'] ?? ''), 160);
$email = trim((string)($_POST['email'] ?? ''));
$phone = clean_text((string)($_POST['phone'] ?? ''), 60);
$service = clean_text((string)($_POST['service'] ?? ''), 100);
$projectVolume = clean_text((string)($_POST['project_volume'] ?? ''), 100);
$timeline = clean_text((string)($_POST['timeline'] ?? ''), 100);
$message = clean_text((string)($_POST['message'] ?? ''), 6000);

if ($fullName === '' || $email === '' || $service === '' || $message === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please complete all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid business email address.'
    ]);
    exit;
}

// Prevent header injection through user-controlled values.
foreach ([$fullName, $company, $phone, $service, $projectVolume, $timeline] as $value) {
    if (preg_match('/[\r\n]/', $value)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid form data.'
        ]);
        exit;
    }
}

$recipient = 'info@quantifydatasolutions.in';
$subject = 'New Project Inquiry - ' . $fullName;

$body = "New project inquiry received from the Quantify Data Solutions website.\n\n";
$body .= "Full Name: {$fullName}\n";
$body .= "Company: " . ($company !== '' ? $company : 'Not provided') . "\n";
$body .= "Business Email: {$email}\n";
$body .= "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n";
$body .= "Service: {$service}\n";
$body .= "Project Volume: " . ($projectVolume !== '' ? $projectVolume : 'Not provided') . "\n";
$body .= "Timeline: " . ($timeline !== '' ? $timeline : 'Not provided') . "\n\n";
$body .= "Project Details:\n{$message}\n\n";
$body .= "Submitted: " . date('Y-m-d H:i:s T') . "\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Quantify Data Solutions <info@quantifydatasolutions.in>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION
];

$sent = mail(
    $recipient,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers)
);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not send your inquiry right now. Please email info@quantifydatasolutions.in directly.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Thank you. Your inquiry has been sent successfully. Our team will get back to you soon.'
]);
