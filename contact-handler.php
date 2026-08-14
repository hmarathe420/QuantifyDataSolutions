<?php
/**
 * Quantify Data Solutions - Contact Form Handler
 *
 * Sends project inquiries through Hostinger SMTP.
 *
 * IMPORTANT:
 * Set these environment variables on the production server:
 * QDS_SMTP_HOST=smtp.hostinger.com
 * QDS_SMTP_PORT=465
 * QDS_SMTP_USER=info@quantifydatasolutions.in
 * QDS_SMTP_PASS=<mailbox password>
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function clean_text(string $value, int $maxLength = 2000): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\0"], '', $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength) : substr($value, 0, $maxLength);
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
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid business email address.']);
    exit;
}

foreach ([$fullName, $company, $phone, $service, $projectVolume, $timeline] as $value) {
    if (preg_match('/[\r\n]/', $value)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Invalid form data.']);
        exit;
    }
}

$smtpHost = getenv('QDS_SMTP_HOST') ?: 'smtp.hostinger.com';
$smtpPort = (int)(getenv('QDS_SMTP_PORT') ?: 465);
$smtpUser = getenv('QDS_SMTP_USER') ?: 'info@quantifydatasolutions.in';
$smtpPass = getenv('QDS_SMTP_PASS');

if (!$smtpPass) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Email service is not configured yet.']);
    exit;
}

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

/**
 * Minimal SMTP client using PHP stream sockets.
 * This avoids requiring Composer/PHPMailer on the Hostinger account.
 */
function smtp_read($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') break;
    }
    return $response;
}

function smtp_expect($socket, array $codes): void
{
    $response = smtp_read($socket);
    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $codes, true)) {
        throw new RuntimeException('SMTP server returned an unexpected response.');
    }
}

function smtp_command($socket, string $command, array $codes): void
{
    fwrite($socket, $command . "\r\n");
    smtp_expect($socket, $codes);
}

function smtp_send(string $host, int $port, string $username, string $password, string $from, string $to, string $replyTo, string $subject, string $body): void
{
    $socket = @stream_socket_client(
        'ssl://' . $host . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );

    if (!$socket) {
        throw new RuntimeException('Unable to connect to the email server.');
    }

    stream_set_timeout($socket, 20);

    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO quantifydatasolutions.in', [250]);
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $headers = [];
        $headers[] = 'From: Quantify Data Solutions <' . $from . '>';
        $headers[] = 'To: ' . $to;
        $headers[] = 'Reply-To: ' . $replyTo;
        $headers[] = 'Subject: ' . $subject;
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'X-Mailer: QDS Contact Form';

        $payload = implode("\r\n", $headers) . "\r\n\r\n" . $body;
        // SMTP terminates the DATA section with a line containing a single dot.
        // Dot-stuff lines beginning with a dot to prevent premature termination.
        $payload = preg_replace('/(^|\r\n)\./', '$1..', $payload);
        fwrite($socket, $payload . "\r\n.\r\n");
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221, 250]);
    } finally {
        fclose($socket);
    }
}

try {
    smtp_send($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpUser, $smtpUser, $email, $subject, $body);

    echo json_encode([
        'success' => true,
        'message' => 'Thank you. Your inquiry has been sent successfully. Our team will get back to you soon.'
    ]);
} catch (Throwable $error) {
    error_log('QDS contact form SMTP error: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not send your inquiry right now. Please email info@quantifydatasolutions.in directly.'
    ]);
}
