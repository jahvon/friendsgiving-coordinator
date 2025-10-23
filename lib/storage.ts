import { getStore } from '@netlify/blobs';
import type { Guest, Dish, EventConfig } from '@/types';

// Initialize blob store
const getDataStore = () => {
  return getStore({
    name: 'friendsgiving-data',
    consistency: 'strong',
  });
};

// Guest operations
export async function getGuests(): Promise<Guest[]> {
  const store = getDataStore();
  const data = await store.get('guests', { type: 'json' });
  return (data as Guest[]) || [];
}

export async function saveGuests(guests: Guest[]): Promise<void> {
  const store = getDataStore();
  await store.setJSON('guests', guests);
}

export async function addGuest(guest: Omit<Guest, 'id' | 'created_at'>): Promise<Guest> {
  const guests = await getGuests();
  const newGuest: Guest = {
    ...guest,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  guests.push(newGuest);
  await saveGuests(guests);
  return newGuest;
}

export async function updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
  const guests = await getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index === -1) return null;

  guests[index] = { ...guests[index], ...updates };
  await saveGuests(guests);
  return guests[index];
}

// Dish operations
export async function getDishes(): Promise<Dish[]> {
  const store = getDataStore();
  const data = await store.get('dishes', { type: 'json' });
  return (data as Dish[]) || [];
}

export async function saveDishes(dishes: Dish[]): Promise<void> {
  const store = getDataStore();
  await store.setJSON('dishes', dishes);
}

export async function addDish(dish: Omit<Dish, 'id' | 'created_at'>): Promise<Dish> {
  const dishes = await getDishes();
  const newDish: Dish = {
    ...dish,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  dishes.push(newDish);
  await saveDishes(dishes);

  // Mark guest as having claimed a dish
  await updateGuest(dish.guest_id, { dish_claimed: true });

  return newDish;
}

export async function updateDish(id: string, updates: Partial<Dish>): Promise<Dish | null> {
  const dishes = await getDishes();
  const index = dishes.findIndex(d => d.id === id);
  if (index === -1) return null;

  dishes[index] = { ...dishes[index], ...updates };
  await saveDishes(dishes);
  return dishes[index];
}

export async function deleteDish(id: string): Promise<boolean> {
  const dishes = await getDishes();
  const dish = dishes.find(d => d.id === id);
  if (!dish) return false;

  const filtered = dishes.filter(d => d.id !== id);
  await saveDishes(filtered);

  // Check if guest has any other dishes, update accordingly
  const guestDishes = filtered.filter(d => d.guest_id === dish.guest_id);
  if (guestDishes.length === 0) {
    await updateGuest(dish.guest_id, { dish_claimed: false });
  }

  return true;
}

// Event config operations
export async function getEventConfig(): Promise<EventConfig> {
  const store = getDataStore();
  const data = await store.get('event-config', { type: 'json' });

  // Default config if none exists
  const defaultConfig: EventConfig = {
    date: new Date().toISOString(),
    location: 'TBD',
    target_guest_count: 20,
    category_targets: {
      appetizer: 3,
      main: 2,
      side: 4,
      dessert: 3,
      beverage: 2,
    },
  };

  return (data as EventConfig) || defaultConfig;
}

export async function saveEventConfig(config: EventConfig): Promise<void> {
  const store = getDataStore();
  await store.setJSON('event-config', config);
}

// Initialize default data if needed
export async function initializeDefaultData(): Promise<void> {
  const eventConfig = await getEventConfig();
  // getEventConfig already handles default initialization
}
