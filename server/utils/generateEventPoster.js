const { OpenAI } = require('openai');

// Initialize the OpenAI client (make sure OPENAI_API_KEY is set in your environment)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function buildEventPosterPrompt(event) {
  let prompt = `Design a modern professional event poster for "${event.title}" happening on ${event.date.toDateString()} from ${event.startTime} to ${event.endTime} at ${event.location}.`;

  if (event.description) {
    prompt += ` Event details: ${event.description}.`;
  }

  if (event.hostedBy) {
    prompt += ` Hosted by: ${event.hostedBy}.`;
  }
  
  prompt += ` The poster should have: 
  - Vibrant but professional color scheme
  - Clean, minimal design
  - Clear, readable typography
  - Appropriate imagery related to the event
  - Well-organized information hierarchy`;
  
  return prompt;
}

async function generateEventPoster(event) {
  const prompt = buildEventPosterPrompt(event);
  console.log("Generated prompt:", prompt);

  try {
    const testResponse = await openai.images.generate({
  prompt: "A simple test image of a cat",
  n: 1,
  size: "256x256"
});
    console.log("Test response from OpenAI:", testResponse);
    const response = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-2" if you prefer
      prompt: prompt,
      size: "1024x1024", // DALL-E 3 supports 1024x1024, 1024x1792, or 1792x1024
      quality: "standard", // or "hd" for higher quality
      n: 1,
      response_format: "b64_json" // or "url" if you prefer
    });

    console.log("OpenAI image generation response:", response);

    if (!response.data || !response.data[0] || !response.data[0].b64_json) {
      throw new Error("Invalid response format from OpenAI image generation API");
    }

    return response.data[0].b64_json; // or .url if you used that format

  } catch (error) {
    console.error("Detailed error generating poster:", error);
    throw new Error(`Failed to generate event poster: ${error.message}`);
  }
}

module.exports = generateEventPoster;