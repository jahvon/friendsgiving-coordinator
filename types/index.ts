export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';
export type DishCategory = 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage';
export type DishStatus = 'requested' | 'claimed' | 'preparing' | 'confirmed';

export interface Guest {
  id: string;
  name: string;
  phone_number: string;
  cooking_skill: CookingSkill;
  dietary_restrictions: string[];
  dish_claimed: boolean;
  bringing_partner: boolean;
  created_at: string;
}

export interface Dish {
  id: string;
  guest_id: string;
  guest_name: string;
  category: DishCategory;
  dish_name: string;
  status: DishStatus;
  recipe?: string;
  created_at: string;
}

export interface EventConfig {
  date: string;
  location: string;
  target_guest_count: number;
  category_targets: Record<DishCategory, number>;
  reminder_delay_hours: number;
}

export interface PendingReminder {
  id: string;
  guest_id: string;
  guest_name: string;
  phone_number: string;
  scheduled_for: string;
  sent: boolean;
  created_at: string;
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
}

export interface RecipeSuggestion {
  category: DishCategory;
  recipe_name: string;
  difficulty: CookingSkill;
  reasoning: string;
  ingredients_summary: string;
  ingredients: string[];
  instructions: string[];
}
