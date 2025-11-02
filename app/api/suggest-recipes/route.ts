import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDishes, getEventConfig, getGuests } from '@/lib/storage';
import type { RecipeSuggestion, CookingSkill, DishCategory } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { cooking_skill, dietary_restrictions } = body;

    if (!cooking_skill) {
      return NextResponse.json(
        { error: 'Missing required field: cooking_skill' },
        { status: 400 }
      );
    }

    // Get current dishes, guests, and event config to determine what's needed
    const [dishes, eventConfig, guests] = await Promise.all([
      getDishes(),
      getEventConfig(),
      getGuests(),
    ]);

    // Calculate what categories need more dishes
    const categoryCounts: Record<DishCategory, number> = {
      appetizer: 0,
      main: 0,
      side: 0,
      dessert: 0,
      beverage: 0,
    };

    dishes.forEach(dish => {
      categoryCounts[dish.category]++;
    });

    const neededCategories = Object.entries(eventConfig.category_targets)
      .filter(([category, target]) => categoryCounts[category as DishCategory] < target)
      .map(([category]) => category);

    const mostNeededCategory = Object.entries(eventConfig.category_targets)
      .map(([category, target]) => ({
        category: category as DishCategory,
        shortage: target - categoryCounts[category as DishCategory],
      }))
      .sort((a, b) => b.shortage - a.shortage)[0]?.category || 'side';

    // Call Anthropic API for recipe suggestions
    const anthropic = new Anthropic({ apiKey });

    const claimedDishesSummary = dishes
      .map(dish => `- ${dish.dish_name} (${dish.category}) - claimed by ${dish.guest_name}`)
      .join('\n');

    const allDietaryRestrictions = guests
      .flatMap(g => g.dietary_restrictions)
      .filter((value, index, self) => self.indexOf(value) === index);

    const prompt = `You are helping with menu planning for a Friendsgiving dinner. A guest needs recipe suggestions.

Here's the context:
- Guest's cooking skill: ${cooking_skill}
- Guest's personal dietary restrictions: ${dietary_restrictions?.join(', ') || 'None'}
- Total number of guests to serve: ${eventConfig.target_guest_count}

Overall dietary restrictions for all confirmed guests (please try to accommodate as many as possible):
${allDietaryRestrictions.length > 0 ? allDietaryRestrictions.map(r => `- ${r}`).join('\n') : 'No restrictions reported by guests.'}

IMPORTANT: If the guest has personal dietary restrictions, prioritize those. Then, consider the overall restrictions.

About the group:
We are a group of friends in our late 20s and early 30s.
We consist of black (Nigerian, African American, Caribbean) and latino (Colombian, Dominican, Salvadorian, Puerto Rican) folk, so the menu should include some traditions from those culture (with traditional american Thanksgiving influences). Don't suggest anything too out of the box!
When suggesting beverages, please suggest non-alcoholic variations in addition to unique alcoholic options.
The recipe reasoning/description does not need to be centered around the guests' identity, rather it should be centered around the guests' needs.

Here are the dishes already claimed by other guests:
${claimedDishesSummary || 'No dishes have been claimed yet.'}

Current dish balance (what we have vs. what we need):
${Object.entries(categoryCounts)
  .map(([cat, count]) => `- ${cat}: ${count}/${eventConfig.category_targets[cat as DishCategory]}`)
  .join('\n')}

Categories that still need more dishes: ${neededCategories.join(', ') || 'All categories are covered'}
The category we need most right now is "${mostNeededCategory}".

Please suggest 3 recipes that:
1. Match the guest's cooking skill level (${cooking_skill}).
2. Strictly accommodate their personal dietary restrictions: ${dietary_restrictions?.join(', ') || 'None'}.
3. Also consider the dietary restrictions of all guests if possible.
4. Do NOT suggest a recipe that is too similar to one already claimed. Suggest things that may be complementary to the dishes already claimed.
5. Prioritize the most needed category "${mostNeededCategory}", but feel free to suggest from other needed categories as well.
6. Are suitable for a Friendsgiving dinner and serve approximately ${eventConfig.target_guest_count} people (or can be easily scaled).

Return your response as a JSON array of recipe suggestions with this EXACT format:
[
  {
    "category": "appetizer|main|side|dessert|beverage",
    "recipe_name": "Recipe Name",
    "difficulty": "beginner|intermediate|advanced",
    "reasoning": "Why this recipe is a good fit, considering the user's skills, restrictions, and what's already been claimed.",
    "ingredients_summary": "Brief overview of main ingredients",
    "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
    "instructions": ["step 1", "step 2", "step 3"]
  }
]

Make sure to include complete ingredients lists and detailed step-by-step instructions. Only return the JSON array, with no other text before or after it.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse recipe suggestions from API response');
    }

    const suggestions: RecipeSuggestion[] = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      suggestions,
      context: {
        most_needed_category: mostNeededCategory,
        needed_categories: neededCategories,
        current_balance: categoryCounts,
      },
    });
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe suggestions' },
      { status: 500 }
    );
  }
}
