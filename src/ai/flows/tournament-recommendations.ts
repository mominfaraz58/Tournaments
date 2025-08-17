'use server';

/**
 * @fileOverview AI-powered tournament recommendation agent.
 *
 * - getTournamentRecommendations - A function that provides tournament recommendations.
 * - TournamentRecommendationsInput - The input type for the getTournamentRecommendations function.
 * - TournamentRecommendationsOutput - The return type for the getTournamentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TournamentRecommendationsInputSchema = z.object({
  skillLevel: z
    .string()
    .describe('The player skill level, e.g., beginner, intermediate, advanced.'),
  pastPerformance: z
    .string()
    .describe(
      'Summary of the player past tournament performance including win/loss ratio, average ranking, and any notable achievements.'
    ),
  preferences: z
    .string()
    .describe(
      'The player tournament preferences, including preferred game modes, tournament formats, and prize pool sizes.'
    ),
  currentBalance: z
    .number()
    .describe('The current amount of funds available in the player wallet.'),
});
export type TournamentRecommendationsInput = z.infer<
  typeof TournamentRecommendationsInputSchema
>;

const TournamentRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      tournamentName: z.string().describe('The name of the tournament.'),
      description: z.string().describe('A brief description of the tournament.'),
      entryFee: z.number().describe('The entry fee for the tournament.'),
      prizePool: z.number().describe('The total prize pool for the tournament.'),
      estimatedWinningProbability: z
        .number()
        .describe(
          'The estimated probability of the player winning this tournament, expressed as a number between 0 and 1.'
        ),
      reason: z
        .string()
        .describe(
          'A short explanation for why this tournament is recommended, considering the player skill level, past performance and preferences.'
        ),
    })
  ),
});
export type TournamentRecommendationsOutput = z.infer<
  typeof TournamentRecommendationsOutputSchema
>;

export async function getTournamentRecommendations(
  input: TournamentRecommendationsInput
): Promise<TournamentRecommendationsOutput> {
  return tournamentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tournamentRecommendationsPrompt',
  input: {schema: TournamentRecommendationsInputSchema},
  output: {schema: TournamentRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in providing personalized tournament recommendations for Free Fire eSports players in Pakistan.

  Consider the player's skill level, past performance, preferences and current balance to recommend tournaments that offer a good balance of challenge and potential rewards.

  Skill Level: {{{skillLevel}}}
  Past Performance: {{{pastPerformance}}}
  Preferences: {{{preferences}}}
  Current Balance: {{{currentBalance}}}

  Provide a list of tournament recommendations that are most likely to benefit the player, but not focus solely on expected winnings. Avoid recommending tournaments which have little chance of winning or bank balance is too low to sustain.

  Format the output as a JSON object with a "recommendations" array, where each object in the array represents a tournament recommendation.  Include tournamentName, description, entryFee, prizePool, estimatedWinningProbability, and reason for each tournament.
`,
});

const tournamentRecommendationsFlow = ai.defineFlow(
  {
    name: 'tournamentRecommendationsFlow',
    inputSchema: TournamentRecommendationsInputSchema,
    outputSchema: TournamentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
