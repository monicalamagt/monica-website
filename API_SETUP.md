# API Setup Instructions

To enable the ChatGPT-like functionality for answering questions about Monica Lama, you'll need to set up a backend API endpoint.

## Option 1: Using a Serverless Function (Recommended for GitHub Pages)

### Using Vercel, Netlify, or similar:

1. Create a serverless function (e.g., `api/chat.js`):

```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, systemPrompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 200
        })
    });

    const data = await response.json();
    res.status(200).json({ response: data.choices[0].message.content });
}
```

2. Set your OpenAI API key as an environment variable in your hosting platform
3. Update `chat.js` to use your API endpoint

## Option 2: Using a Simple Backend Server

Create a Node.js/Express server that handles the API calls securely.

## Option 3: Update the Knowledge Base

You can also modify `chat.js` to use a predefined knowledge base about Monica Lama instead of using an AI API.

## Security Note

**Never expose your OpenAI API key in client-side code.** Always use a backend service to handle API calls.

