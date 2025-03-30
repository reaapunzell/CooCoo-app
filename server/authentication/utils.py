<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; }
        .otp { font-size: 24px; letter-spacing: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello from {{ app_name }}!</h2>
        <p>Your verification code is:</p>
        <div class="otp">{{ otp }}</div>
        <p>This code will expire in {{ expiry_minutes }} minutes.</p>
        <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Need help? Contact us at <a href="mailto:{{ support_email }}">{{ support_email }}</a></p>
        </div>
    </div>
</body>
</html>
