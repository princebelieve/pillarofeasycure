# EasyCure visual direction

The brand uses fresh leaf green (#b5d68c) as the main colour, sky-blue surfaces (#e4f2fc), pink accents (#f8e6ef), and purple actions (#553578). Text on light surfaces uses dark green, charcoal, or purple. The new hero, rounded image treatment, care strip, carousel, account section, and light lavender footer replace the inherited dark green/gold presentation.

The final theme is `src/styles/easycure-theme.css`, imported after the shared stylesheet so legacy page styles do not determine text/background pairings. Clara's portrait remains the logo until her own photograph is provided.

## Generated imagery

Created with the built-in imagegen tool; exported as optimised 1440 × 960 JPEGs in `public/images`. These are conceptual illustrations, not documentation of EasyCure events, actual employees, or specific products. Original generated PNGs remain in Codex's generated-images folder.

- `easycure-wellness.jpg`: Premium editorial still life of leaf-green botanicals, aloe vera, unlabelled amber glass jars, and herbal tea on a sky-blue tabletop, with a lilac wall and pink linen. Natural daylight, airy composition, no text, logos, readable labels, people, pills, or medical claims.
- `easycure-community.jpg`: Fictional Nigerian adults talking warmly in a bright wellness reception. Leaf-green blouse, light-purple clothing, sky-blue clothing, plants and blush accents. Natural expressions and contemporary everyday styling; no seminar, classroom, doctors' coats, medical procedures, logos, or text.
- `easycure-books.jpg`: Editorial still life of unbranded hardcover books in sky blue, leaf green, purple, and pink beside an open notebook, pen, cup, and small plant by a sunlit window. Calm reading/writing atmosphere, realistic paper textures, no people, text, logos, or readable titles.

The wellness image appears in the hero and product promotion; community imagery appears on About, Journey, Outreach, and distributor promotion; the book image is used for both RESYIN reader/writer adverts. Database-driven product and testimonial media are unchanged.

## Checks

Local browser review covers desktop (1440px) and phone (390px) widths with API access directed to a non-running local endpoint. This allows visual verification without connecting to the copied backend or database. Screenshots and DOM checks verify image loading, text colours, and horizontal overflow. The production Vite build is checked separately. Live customer/admin data and authenticated flows are outside this visual review.
