'use server';
/**
 * @fileOverview A spooky environment generation AI agent.
 *
 * - generateSpookyEnvironment - A function that handles the spooky environment generation process.
 * - GenerateSpookyEnvironmentInput - The input type for the generateSpookyEnvironment function.
 * - GenerateSpookyEnvironmentOutput - The return type for the generateSpookyEnvironment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpookyEnvironmentInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the spooky environment to generate.'),
});
export type GenerateSpookyEnvironmentInput = z.infer<typeof GenerateSpookyEnvironmentInputSchema>;

const GenerateSpookyEnvironmentOutputSchema = z.object({
  description: z.string().describe('A detailed description of the generated spooky environment.'),
});
export type GenerateSpookyEnvironmentOutput = z.infer<typeof GenerateSpookyEnvironmentOutputSchema>;

export async function generateSpookyEnvironment(input: GenerateSpookyEnvironmentInput): Promise<GenerateSpookyEnvironmentOutput> {
  return generateSpookyEnvironmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpookyEnvironmentPrompt',
  input: {schema: GenerateSpookyEnvironmentInputSchema},
  output: {schema: GenerateSpookyEnvironmentOutputSchema},
  prompt: `You are a game master specializing in creating spooky environments for horror games.\n\nYou will use the user's prompt to generate a detailed description of a spooky environment.\n\nPrompt: {{{prompt}}}`,
});

const generateSpookyEnvironmentFlow = ai.defineFlow(
  {
    name: 'generateSpookyEnvironmentFlow',
    inputSchema: GenerateSpookyEnvironmentInputSchema,
    outputSchema: GenerateSpookyEnvironmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
