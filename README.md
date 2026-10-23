<p align="center">
  <img src="assets/icon.png" alt="Agent Smith" width="192" height="192">
</p>

# hugoweaving.ai

Marketing website for [Agent Smith](https://github.com/jchristn/AgentSmith), an open source, self-hosted agent server that connects an AI agent to every part of your production stack. Hosted on GitHub Pages at **[hugoweaving.ai](https://hugoweaving.ai)**.

## Development

Plain static site with no build step, framework or runtime dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Files

- `index.html` - the complete page
- `styles.css` - styling, with dark (default) and light themes driven by CSS variables
- `script.js` - theme toggle, mobile menu, code tabs, copy buttons, hero rain effect and scroll animations
- `assets/` - icon, logo and favicon from the Agent Smith repository
- `CNAME` - GitHub Pages custom domain (`hugoweaving.ai`)

## Deployment

Pushing to `main` deploys through GitHub Pages. Product facts on the page (connector list and tool counts, ports, default credentials, API paths, code samples) come from the Agent Smith repository's `README.md`, `docs/CONNECTORS.md`, `REST_API.md` and the SDK READMEs. Update them here when those change.

## Community

- Discord: https://discord.gg/tRAN8HgvK5
- Issues: https://github.com/jchristn/AgentSmith/issues
