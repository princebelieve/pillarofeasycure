# EasyCure adaptation

This checkout contains the application for **PILLAR OF EASYCURE AND WELLNESS HAVEN**. Existing shopping, distributor, payment, and administration workflows are retained.

## Brand information

- Domain: `pillarofeasycure.com`
- Proprietor/director: Professor Clara Obehi Egonmwan
- CAC business name: PILLAR OF EASYCURE AND WELLNESS HAVEN
- BN number: 9930313
- Registered business address: 13, Uwumarongie Street, GRA, Benin City, Edo State, Nigeria
- Public customer care email: contact@pillarofeasycure.com
- Internal business email (not displayed to customers): info@pillarofeasycure.com
- Admin email: pillarofeasycure@gmail.com
- Public business phone/WhatsApp: +2348029778813
- Palette: fresh leaf green (#b5d68c), purple (#553578), sky blue (#e4f2fc), and soft pink (#f8e6ef). The final visual layer is `client/src/styles/easycure-theme.css`.
- Partner adverts: RESYIN Publications, https://resyinpublications.com/ (reader and writer slides)

Business name, BN number, address, email, and phone are taken from the supplied CAC documents. The title Professor is supplied by the user. Personal residential information, date of birth, and tax identification number are not published.

## Assets still to swap

The supplied logo has been regenerated with the corrected EASYCURE spelling and installed as the website logo, compact navigation emblem, favicon set, Apple touch icon, and PWA icons. The master and regeneration details are in `client/assets`. Clara's portrait uses the logo until her own photo is supplied. New AI-generated botanical, fictional community, and book imagery replaces generic logo placeholders elsewhere. Details and generation briefs are in `client/assets/easycure-visuals.md`. Database-managed images have not been changed.

Inherited training sections, programme promises, mentorship references, and training enquiries have been removed from the homepage, other pages, support assistant, backend support answers, and policy copy. The former membership promotion now explains actual account features such as orders, receipts, profile management, and distributor applications. Database-managed stories and media have not been edited.

Only the supplied EasyCure business affiliations, contact details, and credentials are used in site copy.

## Catalogue data

Imported products remain in EasyCure's own product collection and continue to use the standard product, stock, and checkout workflows. The source catalogue connection and bulk import/export tools have been removed. Removing those tools does not delete or modify existing products.

## Deployment later

No deployment, DNS, Cloudflare connection, or external data write is performed by this adaptation. EasyLife source connection variables have been removed from the local server `.env`; remove the same source credentials from the Render environment and redeploy the server for the disconnection to take effect there. `client/vercel.json` points its future API proxy at `api.pillarofeasycure.com`; provision that API hostname or replace the target with the eventual backend URL before deployment. Configure the new site's actual database, payment keys, email OAuth, Google sign-in, push keys, storage, and client/API environment variables when ready.

Local check: `npm.cmd run build` in client. It does not connect to a database or send payments/emails.
