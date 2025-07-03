const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function buildEventPosterPrompt(event) {
  let prompt = `A modern professional event poster for an "${event.title}" held on ${event.date.toDateString()} from ${event.startTime} to ${event.endTime} at ${event.location}.`;

  prompt += ` The poster should have vibrant colors, a clean minimal design, clear readable text.`;

  if (event.description) {
    prompt += ` Description: ${event.description}.`;
  }

  if (event.hostedBy) {
    prompt += ` Hosted by: ${event.hostedBy}.`;
  }

  if (event.societyLogo) {
    prompt += ` Include the society logo.`;
  }

  return prompt;
}

async function generateEventPoster(event) {
  const prompt = buildEventPosterPrompt(event);
  console.log("Prompt being sent:", prompt);

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024"
  });

  return response.data[0].url;
}
module.exports = generateEventPoster;