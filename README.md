# Smart Lead

A hand-authored HTML/CSS/JavaScript port of https://www.smart-lead.org.ua/, inspected on 19 September 2026. Original Ukrainian copy, artwork, Montserrat font files, gallery images and videos are retained. There is no Elementor, WordPress frontend, jQuery or carousel framework.

- `index.html`: homepage and original content.
- `styles.css`: layout with the original 1024px and 767px breakpoints.
- `app.js`: accessible accordions, dialogs, image galleries, country selection and contact requests.
- `privacy-policy/index.html`: original privacy policy text.
- `contact.js`: server-side Telegram delivery adapter.
- `public/assets`: original local assets.

## Development and deployment

Run `npm install`, then `npm run dev`. `npm run build` produces the static site in `dist/client`. The contact endpoint is a Cloudflare Pages Function in `functions/api/contact.js`.

To publish from GitHub, create a Cloudflare Pages project connected to this repository (`dimamarktarg/smart-lead`), with production branch `main`, build command `npm run build`, and output directory `dist/client`. Cloudflare Pages will deploy future commits to `main` automatically. Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as runtime secrets in the Pages project before testing the contact forms.

## Contact delivery

Forms 4, 7, 8 and 9 keep their original labels and now send the name, phone, form label and Kyiv time directly to the configured Telegram group. The bot token is a production secret and is never stored in the source tree. A real lead was not submitted during QA, so delivery should be verified with one controlled test after deployment.

The published copy does not load the original site's tracking plugins or advertising pixels. The Telegram bot token and chat ID are not included in this repository.
