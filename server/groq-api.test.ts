import { describe, it, expect } from 'vitest';

describe('Groq API Integration', () => {
  it('should validate GROQ_API_KEY by making a test API call', async () => {
    const apiKey = process.env.GROQ_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^gsk_/);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: 'Diga apenas "OK"'
          }
        ],
        max_tokens: 10,
      }),
    });
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('choices');
    expect(data.choices).toHaveLength(1);
  }, 30000); // 30s timeout
});
