import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let secondPrompt = '';

const basePromptPrefix = `Explain concepts using various characters from Simpsons, make it like as if they are having a conversation, make it funny and memorable and use each characters catch phrases.
Explain the concept: `;
// Run first prompt
const generateAction = async (req, res) => {
  // console.log(`API: ${basePromptPrefix}${req.body.userInput}`);
  secondPrompt = `Explain ${req.body.userInput} using various characters from South Park, make it like as if they are having a conversation. Be bold and ridiculous`;
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.87,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    // don't want to use previous completion as a prompt, too many tokens used
    // @todo use the last line of the previous completion as part of the prompt
    // example: `Continue with South Park characters: ${basePromptOutput.text}`
    prompt: `${secondPrompt}`,
    // increase the temperature to make the output more creative
    temperature: 0.95,
    max_tokens: 250,
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
