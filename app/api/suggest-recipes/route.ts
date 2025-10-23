import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getDishes, getEventConfig } from '@/lib/storage';
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

    // Get current dishes and event config to determine what's needed
    const [dishes, eventConfig] = await Promise.all([
      getDishes(),
      getEventConfig(),
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

    const prompt = `You are helping coordinate a Friendsgiving dinner. A guest with ${cooking_skill} cooking skills${
      dietary_restrictions?.length > 0
        ? ` and these dietary restrictions: ${dietary_restrictions.join(', ')}`
        : ''
    } needs recipe suggestions.

Current dish balance:
${Object.entries(categoryCounts)
  .map(([cat, count]) => `- ${cat}: ${count}/${eventConfig.category_targets[cat as DishCategory]}`)
  .join('\n')}

Categories that need more dishes: ${neededCategories.join(', ') || 'All categories are covered'}

Please suggest 3 recipes that:
1. Match the guest's cooking skill level
2. Accommodate their dietary restrictions (if any)
3. Prioritize the category "${mostNeededCategory}" but also include other needed categories
4. Are suitable for serving ${eventConfig.target_guest_count} people

Return your response as a JSON array of recipe suggestions with this EXACT format:
[
  {
    "category": "appetizer|main|side|dessert|beverage",
    "recipe_name": "Recipe Name",
    "difficulty": "beginner|intermediate|advanced",
    "serves": number,
    "reasoning": "Why this recipe is a good fit",
    "ingredients_summary": "Brief overview of main ingredients",
    "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
    "instructions": ["step 1", "step 2", "step 3"]
  }
]

Make sure to include complete ingredients lists and detailed step-by-step instructions.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
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
