# Good & Faithful Wealth Management: Lab Website

## Files
- `index.html`: landing page (video, calculator X-factor, X-factor description in footer)
- `about.html`: second page (business concept, process, faith-based screening)
- `style.css`, `script.js` (calculator), `chatbot.js` (chat widget on both pages)
- `assets/hero.mp4`: **you must add this** (see below)
- `assets/poster.jpg`: optional still shown while the video loads

## 1. Make the video (about 5 seconds)
Gemini (Veo) or any AI video tool. Suggested prompt:

> Cinematic 5-second loop. Golden-hour sunlight over a quiet Texas family home with a wide front porch, a family of four walking toward the door, warm light, gentle slow camera push-in, soft wheat field in the background. Calm, hopeful, no text, no logos.

Download it, rename to `hero.mp4`, and put it in the `assets/` folder. Keep it small (under ~10 MB; GitHub caps single files at 100 MB). The video is muted on purpose, because browsers block autoplay with sound.

## 2. Deploy on GitHub Pages
1. Create a GitHub account, click **New repository**, name it (e.g. `good-faithful`), set it **Public**.
2. Click **Add file → Upload files**, drag in everything in this folder (keep the `assets` folder), and **Commit**.
3. Go to **Settings → Pages**. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
4. After 1-2 minutes your site is live at `https://YOUR-USERNAME.github.io/good-faithful/`.
5. Open it, confirm the video autoplays, the button reaches page 2, and the chat bubble works on both pages. Submit that URL in Canvas.

## Chatbot
Works with no setup: it answers from a built-in knowledge base about the business. If your Lab 3 bot has a public link, you can instead set `CONFIG.endpoint` in `chatbot.js` to a proxy you control. Never paste an API key into front-end code, since anyone can read it.

## Rubric checklist
- [ ] AI-generated video on landing page
- [ ] Autoplay + loop (already configured)
- [ ] Button to second page (`Explore Our Approach`)
- [ ] Chatbot on both pages
- [ ] X-factor + under-50-word description at bottom of landing page (Savings Waterfall; description is 30 words)
