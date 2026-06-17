# API Integration Setup Instructions

Follow these steps to set up the OpenAI API integration for your chat feature.

## Step 1: Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)

## Step 2: Deploy the Serverless Function

### Option A: Using Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   cd "/Users/monicalamagt/Desktop/New Website"
   vercel
   ```
   - Follow the prompts
   - When asked about settings, just press Enter for defaults

4. **Set your OpenAI API key as an environment variable**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - When prompted, paste your OpenAI API key
   - Select "Production", "Preview", and "Development" environments

5. **Redeploy to apply the environment variable**:
   ```bash
   vercel --prod
   ```

6. **Copy your deployment URL** (e.g., `https://your-project.vercel.app`)

### Option B: Using Netlify Functions

1. Create a `netlify/functions/chat.js` file (similar structure to `api/chat.js`)
2. Deploy to Netlify
3. Set `OPENAI_API_KEY` in Netlify's environment variables
4. Update `config.js` with your Netlify function URL

## Step 3: Update Your Config File

1. Open `config.js`
2. Replace `'https://your-project.vercel.app/api/chat'` with your actual Vercel deployment URL:
   ```javascript
   API_URL: 'https://your-actual-project.vercel.app/api/chat'
   ```

## Step 4: Test Locally (Optional)

If you want to test with Vercel locally:

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel dev`
3. Update `config.js` temporarily to: `API_URL: 'http://localhost:3000/api/chat'`
4. Test your chat interface

## Step 5: Deploy Your Website

1. Push all files to your GitHub repository
2. Deploy to GitHub Pages (Settings > Pages)
3. Your chat should now work with the AI!

## Troubleshooting

### "API request failed" error
- Check that your API endpoint URL in `config.js` is correct
- Verify your OpenAI API key is set in Vercel environment variables
- Check Vercel function logs for errors

### CORS errors
- Make sure your `vercel.json` includes the CORS headers
- Verify the API function is deployed correctly

### "OpenAI API key not configured"
- Make sure you set the `OPENAI_API_KEY` environment variable in Vercel
- Redeploy after setting the environment variable

## Cost Note

OpenAI API usage is pay-as-you-go. GPT-3.5-turbo is very affordable (~$0.002 per 1K tokens). Monitor your usage at [OpenAI Usage](https://platform.openai.com/usage).

## Alternative: Use a Knowledge Base Instead

If you prefer not to use OpenAI API, you can modify `chat.js` to use a predefined knowledge base about you. This would be free but less flexible.

