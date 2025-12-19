<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="white-space: pre-wrap;">{!! nl2br(e($messageContent)) !!}</div>
        </div>
        <div style="margin-top: 20px; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
            <p>This email was sent from {{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>

