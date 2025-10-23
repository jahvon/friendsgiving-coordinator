export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';
export type DishCategory = 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage';
export type DishStatus = 'claimed' | 'preparing' | 'confirmed';

export interface Guest {
  id: string;
  name: string;
  email: string;
  cooking_skill: CookingSkill;
  dietary_restrictions: string[];
  dish_claimed: boolean;
  created_at: string;
}

export interface Dish {
  id: string;
  guest_id: string;
  guest_name: string;
  category: DishCategory;
  dish_name: string;
  serves: number;
  status: DishStatus;
  recipe?: string;
  created_at: string;
}

export interface EventConfig {
  date: string;
  location: string;
  target_guest_count: number;
  category_targets: Record<DishCategory, number>;
}

export interface DashboardData {
  guests: Guest[];
  dishes: Dish[];
  event: EventConfig;
  balance: {
    category: DishCategory;
    current: number;
    target: number;
    percentage: number;
  }[];
  total_servings: number;
}

export interface RecipeSuggestion {
  category: DishCategory;
  recipe_name: string;
  difficulty: CookingSkill;
  serves: number;
  reasoning: string;
  ingredients_summary: string;
  ingredients: string[];
  instructions: string[];
}
