# EasyCure adaptation

This checkout adapts the existing EASYLIFE application for **PILLAR OF EASYCURE AND WELLNESS HAVEN**. Existing shopping, distributor, payment, and administration workflows are retained.

## Brand information

- Domain: `pillarofeasycure.com`
- Proprietor/director: Professor Clara Obehi Egonmwan
- CAC business name: PILLAR OF EASYCURE AND WELLNESS HAVEN
- BN number: 9930313
- Registered business address: 13, Uwumarongie Street, GRA, Benin City, Edo State, Nigeria
- Public business email: pillarofeasycure@gmail.com
- Public business phone/WhatsApp: +2348029778813
- Palette: leaf green, purple, sky blue, and soft pink
- Partner adverts: RESYIN Publications, https://resyinpublications.com/ (reader and writer slides)

Business name, BN number, address, email, and phone are taken from the supplied CAC documents. The title Professor is supplied by the user. Personal residential information, date of birth, and tax identification number are not published.

## Assets still to swap

Images are retained as requested, including the existing logo, favicon/PWA icons, CEO portrait, and promotional/community photographs. These are temporary assets, not final EasyCure artwork. Replace the files in `client/public` before launch. The provided logo screenshot spells Easycare; the website follows the registered Easycure name.

No EASYLIFE clinic/supermarket affiliation, social account, optometrist credential, or fixed meeting schedule is carried into EasyCure's text.

## Bulk data

Admins can open **Import & Export** in the sidebar (`/admin/data`), or use the buttons on Products and Content Studio.

Supported JSON datasets: products, content/testimonials, state shipping rates, shipping zones, and transport companies. Download a template, populate it or use an exported JSON array, select the category, choose the file, preview, correct any errors, then import. Limits: 500 records per batch, 5 MB per request. Split larger exports into batches.

Imports only add new records. Existing SKUs, states, company names, and matching content are skipped. IDs, ownership references, timestamps, and deletion/approval request metadata are removed. Media links are retained; files are not downloaded or copied into another storage bucket. Image/video/audio URLs must remain publicly available or be replaced before import. Imports do not send announcement notifications.

Exports exclude accounts, orders, payment credentials, customer records, distributor stock, and other private operational data. Configure payment settings directly for the new business. To export the original site's data through these tools, the same admin transfer routes/UI would need to be installed on its checkout; this task only changes this copy. JSON exports from another source can also be used if they match the downloaded templates.

## Deployment later

No deployment, DNS, Cloudflare connection, external data write, or actual `.env` edit is performed by this adaptation. `client/vercel.json` points its future API proxy at `api.pillarofeasycure.com`; provision that API hostname or replace the target with the eventual backend URL before deployment. Configure the new site's actual database, payment keys, email OAuth, Google sign-in, push keys, storage, and client/API environment variables when ready. Existing `.env` files remain as supplied in the copy.

Local checks: `npm.cmd run build` in client; `node --test src/services/dataTransfer.test.js` in server. These do not connect to a database or send payments/emails.
