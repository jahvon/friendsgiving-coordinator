'use client';

import { useState } from 'react';
import { Sparkles, Plus, ArrowLeft, CheckCircle, ExternalLink, Loader2, RefreshCw, ChefHat } from 'lucide-react';
import type { CookingSkill, RecipeSuggestion, DishCategory } from '@/types';

interface ClaimedDishWithRecipe {
  dish_name: string;
  recipe?: RecipeSuggestion;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cooking_skill: 'intermediate' as CookingSkill,
    dietary_restrictions: '',
  });
  const [guestId, setGuestId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [claimedDishes, setClaimedDishes] = useState<ClaimedDishWithRecipe[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customDish, setCustomDish] = useState({
    dish_name: '',
    category: 'side' as DishCategory,
    serves: 8,
  });
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    setError(null);

    try {
      const suggestResponse = await fetch('/api/suggest-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cooking_skill: formData.cooking_skill,
          dietary_restrictions: formData.dietary_restrictions
            .split(',')
            .map(r => r.trim())
            .filter(Boolean),
        }),
      });

      if (!suggestResponse.ok) {
        throw new Error('Failed to get recipe suggestions');
      }

      const data = await suggestResponse.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create guest
      const guestResponse = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cooking_skill: formData.cooking_skill,
          dietary_restrictions: formData.dietary_restrictions
            .split(',')
            .map(r => r.trim())
            .filter(Boolean),
        }),
      });

      if (!guestResponse.ok) {
        throw new Error('Failed to create guest');
      }

      const guest = await guestResponse.json();
      setGuestId(guest.id);

      // Get initial recipe suggestions
      await fetchSuggestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDish = async (dish: { dish_name: string; category: DishCategory; serves: number }, recipe?: RecipeSuggestion) => {
    if (!guestId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guestId,
          guest_name: formData.name,
          category: dish.category,
          dish_name: dish.dish_name,
          serves: dish.serves,
          status: 'claimed',
          recipe: recipe ? JSON.stringify({
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          }) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim dish');
      }

      setClaimedDishes([...claimedDishes, { dish_name: dish.dish_name, recipe }]);
      setShowCustomForm(false);
      setCustomDish({ dish_name: '', category: 'side', serves: 8 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim dish');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDish.dish_name.trim()) {
      setError('Please enter a dish name');
      return;
    }
    handleClaimDish(customDish);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="font-display text-4xl font-semibold mb-8 text-terra-900">
          {guestId ? `Welcome, ${formData.name}!` : 'Sign Up for Friendsgiving'}
        </h2>

        {!guestId ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-terra-900 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-semibold text-terra-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="cooking_skill" className="block text-base font-semibold text-terra-900 mb-2">
                Cooking Skill Level *
              </label>
              <select
                id="cooking_skill"
                value={formData.cooking_skill}
                onChange={(e) => setFormData({ ...formData, cooking_skill: e.target.value as CookingSkill })}
                className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
              >
                <option value="beginner">Beginner - I keep it simple</option>
                <option value="intermediate">Intermediate - I can handle most recipes</option>
                <option value="advanced">Advanced - I love a challenge</option>
              </select>
            </div>

            <div>
              <label htmlFor="dietary_restrictions" className="block text-base font-semibold text-terra-900 mb-2">
                Dietary Restrictions (optional)
              </label>
              <input
                type="text"
                id="dietary_restrictions"
                placeholder="e.g., vegetarian, gluten-free, nut-free"
                value={formData.dietary_restrictions}
                onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white placeholder:text-terra-400"
              />
            </div>

            {error && (
              <div className="bg-warm-50 border border-warm-400 text-warm-900 px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-warm-500 to-warm-600 text-white py-4 px-6 rounded-full hover:from-warm-600 hover:to-warm-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Recipe Suggestions
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {claimedDishes.length > 0 && (
              <div className="bg-sage-50 border border-sage-300 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-sage-700" />
                  <h3 className="font-semibold text-terra-900 text-lg">Your Claimed Dishes</h3>
                </div>
                <div className="space-y-4">
                  {claimedDishes.map((dish, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-terra-800 font-medium">
                          <CheckCircle className="w-5 h-5 text-sage-600 mr-2 flex-shrink-0" />
                          <span>{dish.dish_name}</span>
                        </div>
                        {dish.recipe && (
                          <button
                            onClick={() => setExpandedRecipe(expandedRecipe === dish.dish_name ? null : dish.dish_name)}
                            className="text-sm text-warm-600 hover:text-warm-700 underline flex items-center gap-1"
                          >
                            <ChefHat className="w-4 h-4" />
                            {expandedRecipe === dish.dish_name ? 'Hide Recipe' : 'View Recipe'}
                          </button>
                        )}
                      </div>
                      {dish.recipe && expandedRecipe === dish.dish_name && (
                        <div className="mt-3 pl-7 bg-white rounded-lg p-4 border border-warm-200">
                          <h4 className="font-semibold text-terra-900 mb-2">Ingredients:</h4>
                          <ul className="list-disc list-inside mb-4 text-terra-800 space-y-1">
                            {dish.recipe.ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                          <h4 className="font-semibold text-terra-900 mb-2">Instructions:</h4>
                          <ol className="list-decimal list-inside text-terra-800 space-y-2">
                            {dish.recipe.instructions.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-warm-50 border border-warm-400 text-warm-900 px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <h3 className="font-display text-2xl font-semibold text-terra-900 mb-4">Choose Your Dish</h3>
              <div className="grid gap-4">
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="w-full p-5 bg-gradient-to-r from-terra-500 to-terra-600 text-white rounded-xl hover:from-terra-600 hover:to-terra-700 transition-all shadow-md font-semibold text-lg flex items-center justify-center gap-2"
                >
                  {showCustomForm ? (
                    <>
                      <ArrowLeft className="w-5 h-5" />
                      Back to Suggestions
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Bring Your Own Specialty Dish
                    </>
                  )}
                </button>
              </div>
            </div>

            {showCustomForm ? (
              <form onSubmit={handleCustomDishSubmit} className="bg-warm-50 border border-warm-300 rounded-xl p-6 space-y-4">
                <h4 className="text-xl font-semibold text-terra-900 mb-4">Add Your Own Dish</h4>

                <div>
                  <label htmlFor="custom_dish_name" className="block text-base font-semibold text-terra-900 mb-2">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    id="custom_dish_name"
                    required
                    value={customDish.dish_name}
                    onChange={(e) => setCustomDish({ ...customDish, dish_name: e.target.value })}
                    placeholder="e.g., Grandma's Famous Apple Pie"
                    className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white placeholder:text-terra-400"
                  />
                </div>

                <div>
                  <label htmlFor="custom_category" className="block text-base font-semibold text-terra-900 mb-2">
                    Category *
                  </label>
                  <select
                    id="custom_category"
                    value={customDish.category}
                    onChange={(e) => setCustomDish({ ...customDish, category: e.target.value as DishCategory })}
                    className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
                  >
                    <option value="appetizer">Appetizer</option>
                    <option value="main">Main Course</option>
                    <option value="side">Side Dish</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="custom_serves" className="block text-base font-semibold text-terra-900 mb-2">
                    Serves (number of people)
                  </label>
                  <input
                    type="number"
                    id="custom_serves"
                    min="1"
                    max="50"
                    value={customDish.serves}
                    onChange={(e) => setCustomDish({ ...customDish, serves: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-warm-500 to-warm-600 text-white py-3 px-6 rounded-full hover:from-warm-600 hover:to-warm-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold text-lg shadow-md"
                >
                  {loading ? 'Adding Dish...' : 'Claim This Dish'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-warm-600" />
                    <h4 className="text-xl font-semibold text-terra-900">AI-Powered Suggestions For You</h4>
                  </div>
                  <button
                    onClick={fetchSuggestions}
                    disabled={loadingSuggestions}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 disabled:bg-gray-200 disabled:text-gray-500 font-semibold transition-all border border-sky-200"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                    Load More
                  </button>
                </div>

                {loadingSuggestions ? (
                  <div className="flex flex-col items-center justify-center py-12 text-warm-600">
                    <Loader2 className="w-12 h-12 animate-spin mb-3" />
                    <p className="text-lg font-medium">Finding perfect recipes for you...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-8 text-terra-600">
                    <p>No suggestions yet. Click &quot;Load More&quot; to get started!</p>
                  </div>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <div key={index} className="border border-warm-200 rounded-xl p-6 bg-white hover:border-warm-400 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-terra-900 mb-1">{suggestion.recipe_name}</h3>
                          <p className="text-base text-terra-700">
                            <span className="capitalize font-medium">{suggestion.category}</span> •
                            <span className="capitalize"> {suggestion.difficulty}</span> •
                            <span> Serves {suggestion.serves}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleClaimDish({
                            dish_name: suggestion.recipe_name,
                            category: suggestion.category,
                            serves: suggestion.serves
                          }, suggestion)}
                          disabled={loading || claimedDishes.some(d => d.dish_name === suggestion.recipe_name)}
                          className="bg-gradient-to-r from-warm-500 to-warm-600 text-white px-6 py-3 rounded-full hover:from-warm-600 hover:to-warm-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold shadow-md whitespace-nowrap"
                        >
                          {claimedDishes.some(d => d.dish_name === suggestion.recipe_name) ? 'Claimed' : 'Claim This'}
                        </button>
                      </div>
                      <p className="text-terra-800 mb-3 text-base">{suggestion.reasoning}</p>
                      <p className="text-terra-700 text-sm mb-3">
                        <strong>Key ingredients:</strong> {suggestion.ingredients_summary}
                      </p>

                      <details className="bg-cream-100 rounded-lg p-4 border border-warm-200">
                        <summary className="cursor-pointer font-semibold text-terra-900 hover:text-warm-700">
                          View Full Recipe
                        </summary>
                        <div className="mt-3 space-y-3">
                          <div>
                            <h5 className="font-semibold text-terra-900 mb-2">Ingredients:</h5>
                            <ul className="list-disc list-inside text-terra-800 space-y-1">
                              {suggestion.ingredients.map((ing, i) => (
                                <li key={i}>{ing}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-terra-900 mb-2">Instructions:</h5>
                            <ol className="list-decimal list-inside text-terra-800 space-y-2">
                              {suggestion.instructions.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="text-center pt-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white border border-terra-400 text-terra-700 px-6 py-3 rounded-xl hover:bg-terra-50 hover:border-terra-500 font-semibold transition-all shadow-sm"
              >
                <ExternalLink className="w-5 h-5" />
                View Full Menu & Guest List
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
