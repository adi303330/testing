'use server';
/**
 * @fileOverview A flow for generating unique player objectives for each game playthrough.
 *
 * - generatePlayerObjectives - A function that generates a quest or challenge for the player.
 * - GeneratePlayerObjectivesInput - The input type for the generatePlayerObjectives function.
 * - GeneratePlayerObjectivesOutput - The return type for the generatePlayerObjectives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlayerObjectivesInputSchema = z.object({
  environmentDescription: z
    .string()
    .describe('A description of the game environment.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the game.'),
});
export type GeneratePlayerObjectivesInput = z.infer<
  typeof GeneratePlayerObjectivesInputSchema
>;

const GeneratePlayerObjectivesOutputSchema = z.object({
  objective: z.string().describe('The generated quest or challenge for the player.'),
  reward: z.string().describe('The reward for completing the objective.'),
});
export type GeneratePlayerObjectivesOutput = z.infer<
  typeof GeneratePlayerObjectivesOutputSchema
>;

export async function generatePlayerObjectives(
  input: GeneratePlayerObjectivesInput
): Promise<GeneratePlayerObjectivesOutput> {
  return generatePlayerObjectivesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlayerObjectivesPrompt',
  input: {schema: GeneratePlayerObjectivesInputSchema},
  output: {schema: GeneratePlayerObjectivesOutputSchema},
  prompt: `You are a game master creating a quest for a horror game.

    The game is set in the following environment: {{{environmentDescription}}}
    The difficulty level is: {{{difficulty}}}

    Generate a unique quest or challenge for the player, including a reward for completing the objective. Structure the objective and reward as a JSON formatted as:

    {
      "objective": "The quest or challenge for the player",
      "reward": "The reward for completing the objective"
    }`,
});

const generatePlayerObjectivesFlow = ai.defineFlow(
  {
    name: 'generatePlayerObjectivesFlow',
    inputSchema: GeneratePlayerObjectivesInputSchema,
    outputSchema: GeneratePlayerObjectivesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
