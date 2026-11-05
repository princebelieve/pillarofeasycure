$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$publicDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public'))
$source = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot 'easycure-logo-master.png'))

function Write-BrandPng($Filename, [int]$Size, [System.Drawing.Rectangle]$Crop, [double]$Fill = 1.0) {
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $scale = [Math]::Min($Size * $Fill / $Crop.Width, $Size * $Fill / $Crop.Height)
        $width = [int][Math]::Round($Crop.Width * $scale)
        $height = [int][Math]::Round($Crop.Height * $scale)
        $destination = [System.Drawing.Rectangle]::new([int](($Size - $width) / 2), [int](($Size - $height) / 2), $width, $height)
        $graphics.DrawImage($source, $destination, $Crop, [System.Drawing.GraphicsUnit]::Pixel)
        $bitmap.Save((Join-Path $publicDirectory $Filename), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
}

# Coordinates are relative to the inspected 1254px master. Scale if its size changes.
$ratio = $source.Width / 1254.0
function Get-SourceCrop($X, $Y, $Width, $Height) {
    return [System.Drawing.Rectangle]::new([int]($X * $ratio), [int]($Y * $ratio), [int]($Width * $ratio), [int]($Height * $ratio))
}

try {
    $full = [System.Drawing.Rectangle]::new(0, 0, $source.Width, $source.Height)
    $emblem = Get-SourceCrop 365 45 525 950
    $leafAndHands = Get-SourceCrop 405 45 445 470
    Write-BrandPng 'logo.png' 512 $full
    Write-BrandPng 'brand-mark.png' 256 $emblem 0.90
    # Keep the entire emblem within the central maskable-icon safe area.
    Write-BrandPng 'icon-192.png' 192 $emblem 0.70
    Write-BrandPng 'icon-512.png' 512 $emblem 0.70
    Write-BrandPng 'apple-touch-icon.png' 180 $emblem 0.78
    Write-BrandPng 'favicon.png' 96 $leafAndHands 0.88
    Write-BrandPng 'favicon-16.png' 16 $leafAndHands 0.90
    Write-BrandPng 'favicon-32.png' 32 $leafAndHands 0.90
    Write-BrandPng 'favicon-48.png' 48 $leafAndHands 0.90

    # ICO supports embedded PNG images; write exact-size, valid icon entries.
    function Write-Ico($Filename, [int[]]$Sizes) {
        $stream = [IO.File]::Create((Join-Path $publicDirectory $Filename))
        $writer = [IO.BinaryWriter]::new($stream)
        try {
            $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]$Sizes.Count)
            $offset = 6 + 16 * $Sizes.Count
            $images = @()
            foreach ($size in $Sizes) {
                $bytes = [IO.File]::ReadAllBytes((Join-Path $publicDirectory "favicon-$size.png"))
                $images += ,$bytes
                $writer.Write([byte]$size); $writer.Write([byte]$size)
                $writer.Write([byte]0); $writer.Write([byte]0)
                $writer.Write([uint16]1); $writer.Write([uint16]32)
                $writer.Write([uint32]$bytes.Length); $writer.Write([uint32]$offset)
                $offset += $bytes.Length
            }
            foreach ($bytes in $images) { $writer.Write([byte[]]$bytes) }
        } finally { $writer.Dispose() }
    }
    Write-Ico 'favicon-16.ico' @(16)
    Write-Ico 'favicon-32.ico' @(32)
    Write-Ico 'favicon.ico' @(16, 32, 48)
} finally { $source.Dispose() }

Write-Output 'EasyCure logo, favicons, Apple touch icon, and PWA icons generated.'
