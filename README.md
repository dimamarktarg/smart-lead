# Smart Lead

A hand-authored HTML/CSS/JavaScript port of https://www.smart-lead.org.ua/, inspected on 19 September 2026. Original Ukrainian copy, artwork, Montserrat font files, gallery images and videos are retained. There is no Elementor, WordPress frontend, jQuery or carousel framework.

- `index.html`: homepage and original content.
- `styles.css`: layout with the original 1024px and 767px breakpoints.
- `app.js`: accessible accordions, dialogs, image galleries, country selection and contact requests.
- `privacy-policy/index.html`: original privacy policy text.
- `contact.js`: server-side Telegram delivery adapter.
- `public/assets`: original local assets.

## Development and deployment

Run `npm install`, then `npm run dev`. `npm run build` compiles the frontend and packages a Cloudflare-compatible Worker at `dist/server/index.js`. This is a source backup of the currently published site; it does not deploy to GitHub Pages. A separate Cloudflare Pages integration will be needed before this repository can host the site independently.

## Contact delivery

Forms 4, 7, 8 and 9 keep their original labels and now send the name, phone, form label and Kyiv time directly to the configured Telegram group. The bot token is a production secret and is never stored in the source tree. A real lead was not submitted during QA, so delivery should be verified with one controlled test after deployment.

The published copy does not load the original site's tracking plugins or advertising pixels. The Telegram bot token and chat ID must be configured as runtime secrets on the hosting platform. They are not included in this repository.
