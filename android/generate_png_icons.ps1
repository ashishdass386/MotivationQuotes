Add-Type -AssemblyName System.Drawing

$resDir = "c:\Users\cnsware\Desktop\AASHISH\Motiva\android\app\src\main\res"

$densities = @(
    @{ folder = "drawable-mdpi"; size = 24 },
    @{ folder = "drawable-hdpi"; size = 36 },
    @{ folder = "drawable-xhdpi"; size = 48 },
    @{ folder = "drawable-xxhdpi"; size = 72 },
    @{ folder = "drawable-xxxhdpi"; size = 96 }
)

foreach ($d in $densities) {
    $dir = Join-Path $resDir $d.folder
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    $sz = $d.size
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $scale = $sz / 24.0
    
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $clearBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Transparent)
    
    # Draw speech bubble circle
    $g.FillEllipse($whiteBrush, [float](2 * $scale), [float](2 * $scale), [float](20 * $scale), [float](20 * $scale))
    
    # Draw speech bubble tail pointing to bottom left
    $tail = @(
        New-Object System.Drawing.PointF([float](4.5 * $scale), [float](15.5 * $scale)),
        New-Object System.Drawing.PointF([float](2.2 * $scale), [float](21.8 * $scale)),
        New-Object System.Drawing.PointF([float](8.5 * $scale), [float](19.5 * $scale))
    )
    $g.FillPolygon($whiteBrush, $tail)
    
    # Use SourceCopy to cut out quote shapes so they are transparent
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    
    # Left quote cutout
    $q1 = @(
        New-Object System.Drawing.PointF([float](7.8 * $scale), [float](14.0 * $scale)),
        New-Object System.Drawing.PointF([float](10.0 * $scale), [float](14.0 * $scale)),
        New-Object System.Drawing.PointF([float](11.4 * $scale), [float](11.0 * $scale)),
        New-Object System.Drawing.PointF([float](11.4 * $scale), [float](7.5 * $scale)),
        New-Object System.Drawing.PointF([float](7.5 * $scale), [float](7.5 * $scale)),
        New-Object System.Drawing.PointF([float](7.5 * $scale), [float](11.0 * $scale)),
        New-Object System.Drawing.PointF([float](9.2 * $scale), [float](11.0 * $scale))
    )
    $g.FillPolygon($clearBrush, $q1)
    
    # Right quote cutout
    $q2 = @(
        New-Object System.Drawing.PointF([float](13.5 * $scale), [float](14.0 * $scale)),
        New-Object System.Drawing.PointF([float](15.7 * $scale), [float](14.0 * $scale)),
        New-Object System.Drawing.PointF([float](17.1 * $scale), [float](11.0 * $scale)),
        New-Object System.Drawing.PointF([float](17.1 * $scale), [float](7.5 * $scale)),
        New-Object System.Drawing.PointF([float](13.2 * $scale), [float](7.5 * $scale)),
        New-Object System.Drawing.PointF([float](13.2 * $scale), [float](11.0 * $scale)),
        New-Object System.Drawing.PointF([float](14.9 * $scale), [float](11.0 * $scale))
    )
    $g.FillPolygon($clearBrush, $q2)
    
    $outPath = Join-Path $dir "ic_notification_motiqo.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $outPath ($sz x $sz)"
}
