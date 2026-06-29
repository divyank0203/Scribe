const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSummary = async (content) => {
  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Summarize this developer journal entry in 2-3 lines. Extract the key learnings:\n\n${content}`
      }
    ]
  });
  return response.choices[0].message.content;
};

const generateDigest = async (entries) => {
  const entriesText = entries.map((e, i) =>
    `Day ${i + 1} (${new Date(e.createdAt).toDateString()}):\n${e.content}`
  ).join('\n\n---\n\n');

  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Here are a developer's journal entries from the past week. Write a structured weekly digest with these four sections:\n1) Key Accomplishments\n2) Concepts Learned\n3) Challenges Faced\n4) Suggestions for Next Week\n\n${entriesText}`
      }
    ]
  });
  return response.choices[0].message.content;
};

const chatWithEntries = async (question, entries) => {
  const context = entries.map((e, i) =>
    `Entry ${i + 1} (${new Date(e.createdAt).toDateString()}):\n${e.content}`
  ).join('\n\n---\n\n');

  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that answers questions based only on the developer journal entries provided. Do not make up information. If the answer is not in the entries say so clearly.'
      },
      {
        role: 'user',
        content: `Here are my recent journal entries:\n\n${context}\n\nQuestion: ${question}`
      }
    ]
  });
  return response.choices[0].message.content;
};

module.exports = { generateSummary, generateDigest, chatWithEntries };