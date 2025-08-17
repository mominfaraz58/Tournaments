"use server";

import { z } from "zod";
import { getTournamentRecommendations } from "@/ai/flows/tournament-recommendations";
import type { TournamentRecommendationsOutput } from "@/ai/flows/tournament-recommendations";

const formSchema = z.object({
  skillLevel: z.string().min(1, "Skill level is required."),
  pastPerformance: z.string().min(1, "Past performance is required."),
  preferences: z.string().min(1, "Preferences are required."),
  currentBalance: z.coerce.number().min(0, "Current balance must be a positive number."),
});

type State = {
  recommendations: TournamentRecommendationsOutput['recommendations'];
  error?: string | null;
}

export async function getRecommendationsAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = formSchema.safeParse({
      skillLevel: formData.get("skillLevel"),
      pastPerformance: formData.get("pastPerformance"),
      preferences: formData.get("preferences"),
      currentBalance: formData.get("currentBalance"),
    });

    if (!validatedFields.success) {
      return { 
        recommendations: [],
        error: "Invalid form data. Please check your inputs.",
      };
    }
    
    const recommendations = await getTournamentRecommendations(validatedFields.data);
    
    return { recommendations: recommendations.recommendations, error: null };
  } catch (error) {
    console.error(error);
    return {
      recommendations: [],
      error: "Failed to get recommendations. Please try again.",
    };
  }
}
