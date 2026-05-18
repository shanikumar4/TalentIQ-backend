const getAIRecommendation = async (prompt) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'TalentIQ HR System'
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR analyst. Analyze employee data and give concise, actionable recommendations. Always respond in plain text (no markdown). Keep responses under 120 words.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'Unable to generate recommendation at this time.'
}

module.exports = { getAIRecommendation }
