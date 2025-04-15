import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;

export async function generateMenuDescriptionOR(menuName) {
  const prompt = `Write a short, creative restaurant menu description (1–2 sentences) for: "${menuName}".`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', 
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://your-project-domain.com',
          'X-Title': 'FoodRush-AI'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    return 'A flavorful dish you’ll love.';
  }
}
