// Configuration file for API endpoint
// Update this with your deployed serverless function URL

// Option 1: If using Vercel, it will be: https://your-project.vercel.app/api/chat
// Option 2: If using Netlify, it will be: https://your-site.netlify.app/.netlify/functions/chat
// Option 3: If using a custom backend, use your backend URL

const API_CONFIG = {
    // Replace with your actual API endpoint URL
    // For local development with Vercel: 'http://localhost:3000/api/chat'
    // For production: 'https://your-project.vercel.app/api/chat'
    API_URL: 'https://monica-lama-website.vercel.app/api/chat'
};

// Export for use in chat.js
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}

