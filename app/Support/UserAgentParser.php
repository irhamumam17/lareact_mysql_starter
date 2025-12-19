<?php

namespace App\Support;

class UserAgentParser
{
    /**
     * Parse user agent to detect browser and device type (very lightweight heuristics).
     *
     * @return array{0:string,1:string} [browser, device]
     */
    public static function parse(?string $userAgent): array
    {
        $ua = strtolower((string) $userAgent);

        $browser = 'Unknown';
        if ($ua !== '') {
            if (str_contains($ua, 'edg')) {
                $browser = 'Edge';
            } elseif (str_contains($ua, 'chrome') && ! str_contains($ua, 'chromium')) {
                $browser = 'Chrome';
            } elseif (str_contains($ua, 'safari') && ! str_contains($ua, 'chrome')) {
                $browser = 'Safari';
            } elseif (str_contains($ua, 'firefox')) {
                $browser = 'Firefox';
            } elseif (str_contains($ua, 'msie') || str_contains($ua, 'trident')) {
                $browser = 'IE';
            }
        }

        $device = 'Desktop';
        if ($ua !== '') {
            if (str_contains($ua, 'ipad') || str_contains($ua, 'tablet')) {
                $device = 'Tablet';
            } elseif (
                str_contains($ua, 'mobi') ||
                str_contains($ua, 'iphone') ||
                (str_contains($ua, 'android') && ! str_contains($ua, 'tablet'))
            ) {
                $device = 'Mobile';
            }
        }

        return [$browser, $device];
    }
}


