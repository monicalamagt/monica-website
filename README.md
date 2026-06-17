# My Website

A clean and minimal website with a beige background and brown text.

## GitHub Pages Setup

To deploy this website to GitHub Pages:

1. Create a new repository on GitHub
2. Push these files to your repository
3. Go to Settings > Pages in your GitHub repository
4. Select the branch (usually `main` or `master`) and folder (`/root`)
5. Your site will be available at `https://yourusername.github.io/repository-name/`

## Files

- `index.html` - Main HTML file
- `chat.html` - Chat interface page
- `styles.css` - Stylesheet with beige background and brown text
- `script.js` - Custom cursor functionality
- `chat.js` - Chat interface logic
- `config.js` - API endpoint configuration
- `api/chat.js` - Serverless function for OpenAI API (deploy to Vercel)

## Chat Feature Setup

To enable the AI chat feature that answers questions about you:

1. **Get an OpenAI API key** from [OpenAI Platform](https://platform.openai.com/)
2. **Deploy the serverless function** to Vercel (see `SETUP_INSTRUCTIONS.md`)
3. **Update `config.js`** with your deployed API URL
4. **Deploy your site** to GitHub Pages

For detailed step-by-step instructions, see `SETUP_INSTRUCTIONS.md`.

