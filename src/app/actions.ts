'use server';

import {
  generatePlayerObjectives as generatePlayerObjectivesFlow,
  type GeneratePlayerObjectivesInput,
  type GeneratePlayerObjectivesOutput,
} from '@/ai/flows/generate-player-objectives';
import {
  generateSpookyEnvironment as generateSpookyEnvironmentFlow,
  type GenerateSpookyEnvironmentInput,
  type GenerateSpookyEnvironmentOutput,
} from '@/ai/flows/generate-spooky-environment';

export type {
  GeneratePlayerObjectivesInput,
  GeneratePlayerObjectivesOutput,
  GenerateSpookyEnvironmentInput,
  GenerateSpookyEnvironmentOutput,
};

export async function generateSpookyEnvironment(
  input: GenerateSpookyEnvironmentInput
): Promise<GenerateSpookyEnvironmentOutput> {
  try {
    return await generateSpookyEnvironmentFlow(input);
  } catch (error) {
    console.error("Error generating spooky environment:", error);
    throw new Error("Failed to conjure a nightmare. Please try again.");
  }
}

export async function generatePlayerObjectives(
  input: GeneratePlayerObjectivesInput
): Promise<GeneratePlayerObjectivesOutput> {
  try {
    return await generatePlayerObjectivesFlow(input);
  } catch (error) {
    console.error("Error generating player objectives:", error);
    throw new Error("Failed to devise a twisted fate. Please try again.");
  }
}
