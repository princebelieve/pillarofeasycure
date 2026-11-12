# EasyCure logo assets

`logo.jpeg` is the uploaded reference, preserved unchanged. `easycure-logo-master.png` is the corrected high-resolution master generated with the built-in imagegen tool.

Generation prompt: Regenerate the supplied logo faithfully, preserving the dark forest-green classical pillar, gold caduceus, cupped hands, leaf with gold veins, white background, and centered composition. Use the correct brand spelling throughout. Render exactly two lines: “PILLAR OF EASYCURE AND” and “WELLNESS HAVEN”. Keep crisp graphic edges and no additional text or decoration.

`generate-brand-assets.ps1` resizes the master with System.Drawing and produces the public files used by the application:

| File | Size | Artwork |
| --- | --- | --- |
| logo.png | 512 × 512 | Full logo and corrected name |
| brand-mark.png | 256 × 256 | Emblem for compact navbar/admin branding |
| icon-192.png | 192 × 192 | Emblem, maskable safe padding |
| icon-512.png | 512 × 512 | Emblem, maskable safe padding |
| apple-touch-icon.png | 180 × 180 | Emblem |
| favicon.png | 96 × 96 | Leaf and hands |
| favicon-16/32/48.png | 16/32/48 square | Leaf and hands |
| favicon-16.ico | 16 × 16 | Leaf and hands |
| favicon-32.ico | 32 × 32 | Leaf and hands |
| favicon.ico | 16, 32, 48 entries | Leaf and hands |

Navbar, footer, admin navigation, sharing previews, and notification fallbacks continue using the established public asset paths. The logo and icons at those paths use the EasyCure branding.
