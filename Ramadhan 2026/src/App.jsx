import { useState, useEffect, useMemo, useCallback } from 'react'

// ─── Ramadan 2026 Date Mapping ───────────────────────────────────────────────
// Ramadan 2026 is expected to start on Feb 28 and end on Mar 29, 2026 (30 days)
const RAMADAN_START = new Date(2026, 1, 28) // Feb 28, 2026
const RAMADAN_DAYS = 30
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getRamadanDays() {
  const days = []
  for (let i = 0; i < RAMADAN_DAYS; i++) {
    const date = new Date(RAMADAN_START)
    date.setDate(date.getDate() + i)
    days.push({
      ramadanDay: i + 1,
      gregorianDate: date,
      dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      dayName: DAY_NAMES[date.getDay()],
      dayShort: DAY_NAMES[date.getDay()].slice(0, 3),
      monthDay: `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`,
    })
  }
  return days
}

const ramadanDays = getRamadanDays()

// ─── Sample Recipes ──────────────────────────────────────────────────────────
const SAMPLE_RECIPES = [
  {
    id: 'r1',
    name: 'Overnight Oats with Dates',
    type: 'sahur',
    servings: 2,
    prepTime: '10 min',
    cookTime: '0 min (overnight)',
    tags: ['quick', 'make-ahead', 'high-fiber'],
    ingredients: [
      '1 cup rolled oats',
      '1 cup milk (or almond milk)',
      '¼ cup Greek yogurt',
      '2 tbsp chia seeds',
      '4 Medjool dates, chopped',
      '1 tbsp honey',
      '½ tsp cinnamon',
      'Pinch of salt',
    ],
    instructions: [
      'Combine oats, milk, yogurt, and chia seeds in a jar.',
      'Add honey, cinnamon, and salt. Stir well.',
      'Fold in chopped dates.',
      'Cover and refrigerate overnight (at least 6 hours).',
      'In the morning, stir and add more milk if needed.',
      'Top with fresh fruits or nuts before serving.',
    ],
  },
  {
    id: 'r2',
    name: 'Egg & Avocado Toast',
    type: 'sahur',
    servings: 2,
    prepTime: '5 min',
    cookTime: '5 min',
    tags: ['quick', 'high-protein'],
    ingredients: [
      '4 slices whole grain bread',
      '2 ripe avocados',
      '4 eggs',
      '1 tbsp butter',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      'Cherry tomatoes for garnish',
    ],
    instructions: [
      'Toast the bread until golden brown.',
      'Mash avocados with salt, pepper, and a squeeze of lemon.',
      'Melt butter in a pan. Fry eggs to your preference.',
      'Spread mashed avocado on toast.',
      'Top each with a fried egg.',
      'Season with salt, pepper, and red pepper flakes.',
    ],
  },
  {
    id: 'r3',
    name: 'Chicken Porridge (Bubur Ayam)',
    type: 'sahur',
    servings: 4,
    prepTime: '15 min',
    cookTime: '45 min',
    tags: ['comfort-food', 'high-protein'],
    ingredients: [
      '1 cup jasmine rice',
      '6 cups chicken broth',
      '2 chicken breasts',
      '2 cloves garlic, minced',
      '1 inch ginger, sliced',
      'Salt and white pepper',
      'Fried shallots for topping',
      'Spring onions, sliced',
      'Soy sauce to taste',
    ],
    instructions: [
      'Wash rice and add to a pot with chicken broth.',
      'Add garlic, ginger, and chicken breasts.',
      'Bring to boil, then simmer for 40 minutes, stirring occasionally.',
      'Remove chicken, shred with two forks.',
      'Season porridge with salt and white pepper.',
      'Serve in bowls, top with shredded chicken.',
      'Garnish with fried shallots, spring onions, and soy sauce.',
    ],
  },
  {
    id: 'r4',
    name: 'Classic Dates & Laban',
    type: 'iftar',
    servings: 1,
    prepTime: '2 min',
    cookTime: '0 min',
    tags: ['quick', 'traditional', 'sunnah'],
    ingredients: [
      '3 Medjool dates',
      '1 glass cold laban (buttermilk) or plain yogurt drink',
      'Pinch of cardamom (optional)',
    ],
    instructions: [
      'Arrange dates on a small plate.',
      'Pour chilled laban into a glass.',
      'Optionally add a pinch of cardamom to the laban.',
      'Break fast with dates first, then sip the laban.',
      'This is the traditional Sunnah way to break the fast.',
    ],
  },
  {
    id: 'r5',
    name: 'Chicken Biryani',
    type: 'iftar',
    servings: 6,
    prepTime: '30 min',
    cookTime: '60 min',
    tags: ['main-dish', 'crowd-pleaser'],
    ingredients: [
      '2 cups basmati rice, soaked 30 min',
      '500g chicken thighs, cut into pieces',
      '2 large onions, sliced thin',
      '1 cup yogurt',
      '4 cloves garlic, minced',
      '1 inch ginger, grated',
      '2 tomatoes, chopped',
      '2 tbsp biryani masala',
      '1 tsp turmeric',
      '½ tsp saffron in 3 tbsp warm milk',
      'Fresh mint and cilantro',
      '3 tbsp ghee or oil',
      'Salt to taste',
    ],
    instructions: [
      'Marinate chicken with yogurt, garlic, ginger, biryani masala, turmeric, and salt for 30 min.',
      'Fry sliced onions in ghee until deep golden. Set half aside for garnish.',
      'Add marinated chicken to the pot. Cook on medium heat for 15 minutes.',
      'Add chopped tomatoes, mint, and cilantro. Cook until chicken is done.',
      'Meanwhile, parboil soaked rice until 70% cooked. Drain.',
      'Layer rice over the chicken. Drizzle saffron milk on top.',
      'Scatter fried onions, more mint, and dot with ghee.',
      'Cover tightly and cook on very low heat (dum) for 25 minutes.',
      'Let rest 5 minutes, then gently mix and serve.',
    ],
  },
  {
    id: 'r6',
    name: 'Lentil Soup (Shorbat Adas)',
    type: 'iftar',
    servings: 4,
    prepTime: '10 min',
    cookTime: '30 min',
    tags: ['quick', 'healthy', 'soup'],
    ingredients: [
      '1½ cups red lentils, rinsed',
      '1 onion, diced',
      '2 carrots, diced',
      '3 cloves garlic, minced',
      '1 tsp cumin',
      '½ tsp turmeric',
      '6 cups vegetable broth',
      'Juice of 1 lemon',
      '2 tbsp olive oil',
      'Salt and pepper',
      'Fresh parsley for garnish',
    ],
    instructions: [
      'Heat olive oil in a large pot. Sauté onion until soft.',
      'Add garlic, carrots, cumin, and turmeric. Cook 2 minutes.',
      'Add lentils and broth. Bring to a boil.',
      'Reduce heat and simmer for 25 minutes until lentils are very soft.',
      'Blend until smooth (or leave chunky if preferred).',
      'Stir in lemon juice. Season with salt and pepper.',
      'Serve hot with a drizzle of olive oil and fresh parsley.',
    ],
  },
  {
    id: 'r7',
    name: 'Samosa (Baked)',
    type: 'iftar',
    servings: 12,
    prepTime: '30 min',
    cookTime: '25 min',
    tags: ['appetizer', 'make-ahead'],
    ingredients: [
      '12 spring roll wrappers',
      '2 medium potatoes, boiled and mashed',
      '½ cup green peas',
      '1 small onion, finely diced',
      '2 green chilies, minced',
      '1 tsp cumin seeds',
      '1 tsp garam masala',
      '½ tsp turmeric',
      'Fresh cilantro, chopped',
      '2 tbsp oil + more for brushing',
      'Salt to taste',
    ],
    instructions: [
      'Heat oil. Add cumin seeds until they splutter.',
      'Add onion, green chilies. Sauté until soft.',
      'Add peas, turmeric, garam masala, and salt. Cook 3 min.',
      'Add mashed potatoes and cilantro. Mix well. Let cool.',
      'Cut spring roll wrappers into strips. Form cones.',
      'Fill each cone with potato mixture. Seal edges with water.',
      'Place on a lined baking sheet. Brush with oil.',
      'Bake at 200°C (400°F) for 20-25 min until golden and crisp.',
    ],
  },
  {
    id: 'r8',
    name: 'Banana Smoothie Bowl',
    type: 'sahur',
    servings: 1,
    prepTime: '5 min',
    cookTime: '0 min',
    tags: ['quick', 'healthy', 'high-protein'],
    ingredients: [
      '2 frozen bananas',
      '½ cup Greek yogurt',
      '¼ cup milk',
      '1 tbsp peanut butter',
      '1 tbsp honey',
      'Toppings: granola, sliced fruits, chia seeds, coconut flakes',
    ],
    instructions: [
      'Blend frozen bananas, yogurt, milk, and peanut butter until thick and creamy.',
      'Pour into a bowl.',
      'Drizzle with honey.',
      'Add your favorite toppings: granola, fresh fruits, chia seeds, coconut.',
      'Eat immediately for best texture.',
    ],
  },
  {
    id: 'r9',
    name: 'Lamb Tagine',
    type: 'iftar',
    servings: 4,
    prepTime: '20 min',
    cookTime: '90 min',
    tags: ['main-dish', 'slow-cook'],
    ingredients: [
      '500g lamb shoulder, cubed',
      '1 large onion, diced',
      '3 cloves garlic, minced',
      '1 can chickpeas, drained',
      '1 can diced tomatoes',
      '½ cup dried apricots',
      '2 tsp ras el hanout',
      '1 tsp cinnamon',
      '1 tsp cumin',
      '2 tbsp olive oil',
      'Fresh cilantro',
      'Salt and pepper',
      'Couscous for serving',
    ],
    instructions: [
      'Season lamb with salt, pepper, and half the spices.',
      'Heat olive oil in a tagine or heavy pot. Brown lamb in batches.',
      'Add onion and garlic. Cook until softened.',
      'Add remaining spices, tomatoes, and 1 cup water.',
      'Bring to a boil, then cover and simmer for 1 hour.',
      'Add chickpeas and apricots. Cook 30 more minutes.',
      'Adjust seasoning. The sauce should be thick and rich.',
      'Garnish with cilantro. Serve over fluffy couscous.',
    ],
  },
  {
    id: 'r10',
    name: 'Kunafa (Cheese Pastry)',
    type: 'iftar',
    servings: 8,
    prepTime: '15 min',
    cookTime: '30 min',
    tags: ['dessert', 'crowd-pleaser'],
    ingredients: [
      '500g kunafa (kataifi) dough',
      '250g mozzarella, shredded',
      '250g akkawi cheese (or ricotta)',
      '1 cup butter, melted',
      '1 cup sugar',
      '½ cup water',
      '1 tbsp lemon juice',
      '1 tbsp rose water',
      '1 tbsp orange blossom water',
      'Crushed pistachios for garnish',
    ],
    instructions: [
      'Make syrup: boil sugar and water for 10 min. Add lemon juice, rose water, and orange blossom water. Cool.',
      'Shred kunafa dough finely. Mix with melted butter.',
      'If using akkawi, soak in water for 2 hours to remove salt, then drain.',
      'Press half the dough into a buttered round pan.',
      'Spread mixed cheeses evenly over the dough.',
      'Top with remaining dough. Press down firmly.',
      'Bake at 180°C (350°F) for 25-30 min until golden.',
      'Immediately flip onto a plate. Pour cold syrup over hot kunafa.',
      'Garnish with crushed pistachios. Serve warm.',
    ],
  },
]

// ─── localStorage Helpers ────────────────────────────────────────────────────
const STORAGE_KEY_MEALS = 'ramadan2026_meals'
const STORAGE_KEY_RECIPES = 'ramadan2026_recipes'

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── Icons (inline SVGs) ─────────────────────────────────────────────────────
function CrescentMoon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
    </svg>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [recipes, setRecipes] = useState(() => loadFromStorage(STORAGE_KEY_RECIPES, SAMPLE_RECIPES))
  const [mealPlan, setMealPlan] = useState(() => loadFromStorage(STORAGE_KEY_MEALS, {}))
  const [selectedDay, setSelectedDay] = useState(null)
  const [viewingRecipe, setViewingRecipe] = useState(null)
  const [showRecipeBrowser, setShowRecipeBrowser] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(null) // { dateKey, slotType, meal }
  const [searchQuery, setSearchQuery] = useState('')
  const [mealEditing, setMealEditing] = useState(null) // { dateKey, slotType, meal? }
  const [editingRecipe, setEditingRecipe] = useState(null) // null or recipe object (edit mode) or 'new' (add mode)

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEY_MEALS, mealPlan) }, [mealPlan])
  useEffect(() => { saveToStorage(STORAGE_KEY_RECIPES, recipes) }, [recipes])

  // Check if today is within Ramadan
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const setMeal = useCallback((dateKey, slotType, meal) => {
    setMealPlan(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [slotType]: meal,
      }
    }))
  }, [])

  const removeMeal = useCallback((dateKey, slotType) => {
    setMealPlan(prev => {
      const updated = { ...prev }
      if (updated[dateKey]) {
        updated[dateKey] = { ...updated[dateKey] }
        delete updated[dateKey][slotType]
        if (Object.keys(updated[dateKey]).length === 0) delete updated[dateKey]
      }
      return updated
    })
  }, [])

  const copyMealToDays = useCallback((meal, slotType, targetDateKeys) => {
    setMealPlan(prev => {
      const updated = { ...prev }
      targetDateKeys.forEach(dk => {
        updated[dk] = { ...updated[dk], [slotType]: { ...meal } }
      })
      return updated
    })
  }, [])

  const addRecipe = useCallback((recipe) => {
    const newRecipe = { ...recipe, id: 'r' + Date.now() }
    setRecipes(prev => [...prev, newRecipe])
    return newRecipe
  }, [])

  const updateRecipe = useCallback((id, updatedRecipe) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...updatedRecipe, id } : r))
    // Also update any meal plan references to this recipe
    setMealPlan(prev => {
      const updated = { ...prev }
      for (const dateKey in updated) {
        const day = { ...updated[dateKey] }
        let changed = false
        for (const slot of ['sahur', 'iftar']) {
          if (day[slot]?.recipe?.id === id) {
            day[slot] = { ...day[slot], name: updatedRecipe.name, recipe: { ...updatedRecipe, id } }
            changed = true
          }
        }
        if (changed) updated[dateKey] = day
      }
      return updated
    })
  }, [])

  const deleteRecipe = useCallback((id) => {
    setRecipes(prev => prev.filter(r => r.id !== id))
    // Clear meal plan references to deleted recipe
    setMealPlan(prev => {
      const updated = { ...prev }
      for (const dateKey in updated) {
        const day = { ...updated[dateKey] }
        let changed = false
        for (const slot of ['sahur', 'iftar']) {
          if (day[slot]?.recipe?.id === id) {
            day[slot] = { ...day[slot], recipe: null }
            changed = true
          }
        }
        if (changed) updated[dateKey] = day
      }
      return updated
    })
  }, [])

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-teal-950/95 to-teal-900/95 border-b border-gold-500/20 px-4 py-4" style={{ backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CrescentMoon className="text-gold-400" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-warm-50 tracking-tight">
                Ramadan 2026 Meal Planner
              </h1>
              <p className="text-xs text-gold-400/70">28 Feb – 29 Mar 2026 · 1447 AH</p>
            </div>
          </div>
          <button
            onClick={() => setShowRecipeBrowser(true)}
            className="flex items-center gap-2 bg-gold-500/15 hover:bg-gold-500/25 text-gold-400 px-3 py-2 rounded-lg text-sm transition-colors border border-gold-500/20"
          >
            <BookIcon /> Recipes
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ramadanDays.map(day => (
            <DayCard
              key={day.dateKey}
              day={day}
              isToday={day.dateKey === todayKey}
              meals={mealPlan[day.dateKey] || {}}
              onViewRecipe={setViewingRecipe}
              onEditMeal={(slotType, meal) => setMealEditing({ dateKey: day.dateKey, slotType, meal })}
              onAddMeal={(slotType) => setMealEditing({ dateKey: day.dateKey, slotType })}
              onRemoveMeal={(slotType) => removeMeal(day.dateKey, slotType)}
              onCopyMeal={(slotType, meal) => setShowCopyModal({ dateKey: day.dateKey, slotType, meal })}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      {viewingRecipe && (
        <RecipeModal
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
          onEditRecipe={(recipe) => { setEditingRecipe(recipe); setViewingRecipe(null) }}
          onDeleteRecipe={(id) => { deleteRecipe(id); setViewingRecipe(null) }}
        />
      )}
      {mealEditing && (
        <MealEditorModal
          dateKey={mealEditing.dateKey}
          slotType={mealEditing.slotType}
          existingMeal={mealEditing.meal}
          recipes={recipes}
          onSave={(meal) => {
            setMeal(mealEditing.dateKey, mealEditing.slotType, meal)
            setMealEditing(null)
          }}
          onClose={() => setMealEditing(null)}
          onAddRecipe={addRecipe}
        />
      )}
      {showCopyModal && (
        <CopyMealModal
          meal={showCopyModal.meal}
          slotType={showCopyModal.slotType}
          sourceDateKey={showCopyModal.dateKey}
          ramadanDays={ramadanDays}
          onCopy={(targetKeys) => {
            copyMealToDays(showCopyModal.meal, showCopyModal.slotType, targetKeys)
            setShowCopyModal(null)
          }}
          onClose={() => setShowCopyModal(null)}
        />
      )}
      {showRecipeBrowser && (
        <RecipeBrowserModal
          recipes={recipes}
          onViewRecipe={setViewingRecipe}
          onClose={() => setShowRecipeBrowser(false)}
          onAddRecipe={addRecipe}
          onEditRecipe={(recipe) => setEditingRecipe(recipe === 'new' ? 'new' : recipe)}
          onDeleteRecipe={deleteRecipe}
        />
      )}
      {editingRecipe !== null && (
        <RecipeEditorModal
          existingRecipe={editingRecipe !== 'new' ? editingRecipe : undefined}
          onSave={(recipe) => {
            if (editingRecipe !== 'new' && editingRecipe?.id) {
              updateRecipe(editingRecipe.id, recipe)
            } else {
              addRecipe(recipe)
            }
            setEditingRecipe(null)
          }}
          onClose={() => setEditingRecipe(null)}
        />
      )}
    </div>
  )
}

// ─── Day Card ────────────────────────────────────────────────────────────────
function DayCard({ day, isToday, meals, onViewRecipe, onEditMeal, onAddMeal, onRemoveMeal, onCopyMeal }) {
  return (
    <div className={`day-card rounded-xl overflow-hidden ${isToday ? 'ring-2 ring-gold-400 shadow-lg shadow-gold-500/20' : 'ring-1 ring-white/10'}`}
      style={{ background: 'linear-gradient(135deg, rgba(13,59,59,0.9), rgba(10,47,47,0.95))' }}>
      {/* Day Header */}
      <div className={`px-3 py-2 flex items-center justify-between ${isToday ? 'bg-gold-500/20' : 'bg-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gold-400">{day.ramadanDay}</span>
          <div className="text-xs">
            <div className="text-warm-100 font-medium">{day.dayShort}</div>
            <div className="text-warm-300/60">{day.monthDay}</div>
          </div>
        </div>
        {isToday && (
          <span className="text-[0.6rem] uppercase tracking-wider bg-gold-500 text-teal-950 font-bold px-2 py-0.5 rounded-full">
            Today
          </span>
        )}
      </div>

      {/* Meal Slots */}
      <div className="p-2 space-y-2">
        <MealSlot
          label="Sahur"
          icon="🌙"
          meal={meals.sahur}
          onView={() => meals.sahur?.recipe && onViewRecipe(meals.sahur.recipe)}
          onEdit={() => onEditMeal('sahur', meals.sahur)}
          onAdd={() => onAddMeal('sahur')}
          onRemove={() => onRemoveMeal('sahur')}
          onCopy={() => meals.sahur && onCopyMeal('sahur', meals.sahur)}
        />
        <MealSlot
          label="Iftar"
          icon="🌅"
          meal={meals.iftar}
          onView={() => meals.iftar?.recipe && onViewRecipe(meals.iftar.recipe)}
          onEdit={() => onEditMeal('iftar', meals.iftar)}
          onAdd={() => onAddMeal('iftar')}
          onRemove={() => onRemoveMeal('iftar')}
          onCopy={() => meals.iftar && onCopyMeal('iftar', meals.iftar)}
        />
      </div>
    </div>
  )
}

// ─── Meal Slot ───────────────────────────────────────────────────────────────
function MealSlot({ label, icon, meal, onView, onEdit, onAdd, onRemove, onCopy }) {
  if (!meal) {
    return (
      <button
        onClick={onAdd}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg border border-dashed border-white/15 hover:border-gold-400/40 hover:bg-white/5 text-white/40 hover:text-gold-400 text-xs transition-all"
      >
        <span>{icon}</span>
        <span>Add {label}</span>
        <PlusIcon />
      </button>
    )
  }

  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs">{icon}</span>
            <span className="text-[0.65rem] uppercase tracking-wider text-gold-400/70 font-medium">{label}</span>
          </div>
          <p className="text-sm font-medium text-warm-100 truncate">{meal.name}</p>
          {meal.description && (
            <p className="text-xs text-warm-300/50 truncate mt-0.5">{meal.description}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {meal.recipe && (
            <button onClick={onView} className="p-1 text-gold-400/60 hover:text-gold-400 transition-colors" title="View Recipe">
              <BookIcon />
            </button>
          )}
          <button onClick={onCopy} className="p-1 text-white/30 hover:text-gold-400 transition-colors" title="Copy to other days">
            <CopyIcon />
          </button>
          <button onClick={onEdit} className="p-1 text-white/30 hover:text-teal-400 transition-colors" title="Edit">
            <EditIcon />
          </button>
          <button onClick={onRemove} className="p-1 text-white/30 hover:text-red-400 transition-colors" title="Remove">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Recipe Modal ────────────────────────────────────────────────────────────
function RecipeModal({ recipe, onClose, onEditRecipe, onDeleteRecipe }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="animate-fadeIn bg-gradient-to-b from-teal-900 to-teal-950 rounded-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-teal-900/95 px-5 py-4 border-b border-gold-500/10 flex items-start justify-between" style={{ backdropFilter: 'blur(8px)' }}>
          <div>
            <h2 className="text-lg font-bold text-warm-50">{recipe.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-warm-300/60">
              {recipe.servings && <span>Serves {recipe.servings}</span>}
              {recipe.prepTime && (
                <span className="flex items-center gap-1"><ClockIcon /> Prep: {recipe.prepTime}</span>
              )}
              {recipe.cookTime && (
                <span className="flex items-center gap-1"><ClockIcon /> Cook: {recipe.cookTime}</span>
              )}
            </div>
            {recipe.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="recipe-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onEditRecipe && (
              <button
                onClick={() => onEditRecipe(recipe)}
                className="p-1.5 text-white/40 hover:text-teal-400 transition-colors"
                title="Edit recipe"
              >
                <EditIcon />
              </button>
            )}
            {onDeleteRecipe && (
              <button
                onClick={() => { if (confirm('Delete "' + recipe.name + '"?')) { onDeleteRecipe(recipe.id); onClose() } }}
                className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                title="Delete recipe"
              >
                <TrashIcon />
              </button>
            )}
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Ingredients */}
          <section>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-2">Ingredients</h3>
            <ul className="space-y-1.5">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="text-sm text-warm-100/80 flex items-start gap-2">
                  <span className="text-gold-500/50 mt-1">•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section>
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-2">Instructions</h3>
            <ol className="space-y-2">
              {recipe.instructions?.map((step, i) => (
                <li key={i} className="text-sm text-warm-100/80 flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gold-500/15 text-gold-400 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Meal Editor Modal ───────────────────────────────────────────────────────
function MealEditorModal({ dateKey, slotType, existingMeal, recipes, onSave, onClose, onAddRecipe }) {
  const [name, setName] = useState(existingMeal?.name || '')
  const [description, setDescription] = useState(existingMeal?.description || '')
  const [selectedRecipe, setSelectedRecipe] = useState(existingMeal?.recipe || null)
  const [recipeSearch, setRecipeSearch] = useState('')
  const [showRecipeList, setShowRecipeList] = useState(!existingMeal)

  const day = ramadanDays.find(d => d.dateKey === dateKey)
  const filteredRecipes = useMemo(() => {
    const q = recipeSearch.toLowerCase()
    return recipes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    )
  }, [recipes, recipeSearch])

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setName(recipe.name)
    setDescription('')
    setShowRecipeList(false)
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      recipe: selectedRecipe,
    })
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="animate-slideUp bg-gradient-to-b from-teal-900 to-teal-950 rounded-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
        <div className="px-5 py-4 border-b border-gold-500/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-warm-50">
              {existingMeal ? 'Edit' : 'Add'} {slotType === 'sahur' ? 'Sahur' : 'Iftar'}
            </h2>
            <p className="text-xs text-warm-300/50">Day {day?.ramadanDay} · {day?.monthDay}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><CloseIcon /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Recipe picker */}
          {showRecipeList ? (
            <div>
              <div className="relative mb-3">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={recipeSearch}
                  onChange={e => setRecipeSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40"
                />
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredRecipes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRecipe(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedRecipe?.id === r.id
                        ? 'bg-gold-500/20 text-gold-400'
                        : 'hover:bg-white/5 text-warm-100/80'
                    }`}
                  >
                    <span className="font-medium">{r.name}</span>
                    <div className="flex gap-1 mt-0.5">
                      {r.tags?.slice(0, 3).map(t => (
                        <span key={t} className="recipe-tag">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
                {filteredRecipes.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-4">No recipes found</p>
                )}
              </div>
              <button
                onClick={() => setShowRecipeList(false)}
                className="mt-2 text-xs text-gold-400/60 hover:text-gold-400"
              >
                Or enter a custom meal name
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs text-warm-300/60 mb-1">Meal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Chicken Rice"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40"
                />
              </div>
              <div>
                <label className="block text-xs text-warm-300/60 mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief note..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40"
                />
              </div>
              {selectedRecipe && (
                <div className="text-xs text-gold-400/70 flex items-center gap-1">
                  <BookIcon /> Linked to recipe: {selectedRecipe.name}
                </div>
              )}
              <button
                onClick={() => setShowRecipeList(true)}
                className="text-xs text-gold-400/60 hover:text-gold-400"
              >
                {selectedRecipe ? 'Change recipe' : 'Browse recipes'}
              </button>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-white/5 text-warm-300/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              {existingMeal ? 'Update' : 'Add'} Meal
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Copy Meal Modal ─────────────────────────────────────────────────────────
function CopyMealModal({ meal, slotType, sourceDateKey, ramadanDays, onCopy, onClose }) {
  const [selectedDays, setSelectedDays] = useState([])

  const toggleDay = (dateKey) => {
    setSelectedDays(prev =>
      prev.includes(dateKey)
        ? prev.filter(k => k !== dateKey)
        : [...prev, dateKey]
    )
  }

  const selectAll = () => {
    const allKeys = ramadanDays.filter(d => d.dateKey !== sourceDateKey).map(d => d.dateKey)
    setSelectedDays(allKeys)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="animate-slideUp bg-gradient-to-b from-teal-900 to-teal-950 rounded-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
        <div className="px-5 py-4 border-b border-gold-500/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-warm-50">Copy Meal</h2>
            <p className="text-xs text-warm-300/50">
              Copy "{meal.name}" ({slotType}) to other days
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><CloseIcon /></button>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-warm-300/60">Select days:</span>
            <button onClick={selectAll} className="text-xs text-gold-400/70 hover:text-gold-400">
              Select all
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {ramadanDays.map(day => {
              const isSource = day.dateKey === sourceDateKey
              const isSelected = selectedDays.includes(day.dateKey)
              return (
                <button
                  key={day.dateKey}
                  disabled={isSource}
                  onClick={() => toggleDay(day.dateKey)}
                  className={`p-1.5 rounded-lg text-center text-xs transition-all ${
                    isSource
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : isSelected
                        ? 'bg-gold-500/25 text-gold-400 ring-1 ring-gold-500/40'
                        : 'bg-white/5 text-warm-100/60 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold">{day.ramadanDay}</div>
                  <div className="text-[0.6rem] opacity-60">{day.dayShort}</div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-white/5 text-warm-300/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onCopy(selectedDays)}
              disabled={selectedDays.length === 0}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              Copy to {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Recipe Editor Modal ─────────────────────────────────────────────────────
function RecipeEditorModal({ existingRecipe, onSave, onClose }) {
  const [name, setName] = useState(existingRecipe?.name || '')
  const [type, setType] = useState(existingRecipe?.type || 'iftar')
  const [servings, setServings] = useState(existingRecipe?.servings || '')
  const [prepTime, setPrepTime] = useState(existingRecipe?.prepTime || '')
  const [cookTime, setCookTime] = useState(existingRecipe?.cookTime || '')
  const [tags, setTags] = useState(existingRecipe?.tags?.join(', ') || '')
  const [ingredients, setIngredients] = useState(existingRecipe?.ingredients?.join('\n') || '')
  const [instructions, setInstructions] = useState(existingRecipe?.instructions?.join('\n') || '')

  const handleSubmit = () => {
    if (!name.trim()) return
    const recipe = {
      name: name.trim(),
      type,
      servings: servings ? Number(servings) : undefined,
      prepTime: prepTime.trim() || undefined,
      cookTime: cookTime.trim() || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.split('\n').map(l => l.trim()).filter(Boolean),
      instructions: instructions.split('\n').map(l => l.trim()).filter(Boolean),
    }
    onSave(recipe)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="animate-slideUp bg-gradient-to-b from-teal-900 to-teal-950 rounded-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
        <div className="px-5 py-4 border-b border-gold-500/10 flex items-center justify-between">
          <h2 className="text-base font-bold text-warm-50">
            {existingRecipe ? 'Edit Recipe' : 'New Recipe'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1"><CloseIcon /></button>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs text-warm-300/60 mb-1">Recipe Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g., Chicken Biryani"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-warm-300/60 mb-1">Type</label>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {['sahur', 'iftar'].map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex-1 px-3 py-2 text-xs capitalize transition-colors ${
                      type === t ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-warm-300/50 hover:bg-white/10'
                    }`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="w-20">
              <label className="block text-xs text-warm-300/60 mb-1">Servings</label>
              <input type="number" value={servings} onChange={e => setServings(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 focus:outline-none focus:border-gold-500/40" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-warm-300/60 mb-1">Prep Time</label>
              <input type="text" value={prepTime} onChange={e => setPrepTime(e.target.value)}
                placeholder="e.g., 15 min"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-warm-300/60 mb-1">Cook Time</label>
              <input type="text" value={cookTime} onChange={e => setCookTime(e.target.value)}
                placeholder="e.g., 30 min"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-warm-300/60 mb-1">Tags (comma-separated)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="e.g., quick, healthy, high-protein"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40" />
          </div>

          <div>
            <label className="block text-xs text-warm-300/60 mb-1">Ingredients (one per line)</label>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
              rows={4} placeholder="1 cup rice&#10;2 chicken breasts&#10;..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40 resize-none" />
          </div>

          <div>
            <label className="block text-xs text-warm-300/60 mb-1">Instructions (one step per line)</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
              rows={4} placeholder="Wash the rice.&#10;Boil water.&#10;..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40 resize-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-white/5 text-warm-300/60 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!name.trim()}
              className="flex-1 px-4 py-2 rounded-lg text-sm bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium">
              {existingRecipe ? 'Save Changes' : 'Add Recipe'}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Recipe Browser Modal ────────────────────────────────────────────────────
function RecipeBrowserModal({ recipes, onViewRecipe, onClose, onAddRecipe, onEditRecipe, onDeleteRecipe }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchesType = filterType === 'all' || r.type === filterType
      return matchesSearch && matchesType
    })
  }, [recipes, search, filterType])

  return (
    <ModalOverlay onClose={onClose}>
      <div className="animate-fadeIn bg-gradient-to-b from-teal-900 to-teal-950 rounded-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto border border-gold-500/20 shadow-2xl">
        <div className="sticky top-0 bg-teal-900/95 px-5 py-4 border-b border-gold-500/10 z-10" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-warm-50">Recipe Collection</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditRecipe('new')}
                className="flex items-center gap-1 bg-gold-500/15 hover:bg-gold-500/25 text-gold-400 px-3 py-1.5 rounded-lg text-xs transition-colors border border-gold-500/20"
              >
                <PlusIcon /> Add Recipe
              </button>
              <button onClick={onClose} className="text-white/40 hover:text-white p-1"><CloseIcon /></button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search recipes or tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-3 py-2 text-sm text-warm-100 placeholder-white/30 focus:outline-none focus:border-gold-500/40"
              />
            </div>
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              {['all', 'sahur', 'iftar'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-2 text-xs capitalize transition-colors ${
                    filterType === type
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'bg-white/5 text-warm-300/50 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(recipe => (
            <div
              key={recipe.id}
              className="relative p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-gold-500/20 transition-all cursor-pointer"
              onClick={() => { onViewRecipe(recipe); onClose() }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-warm-100">{recipe.name}</h3>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[0.6rem] uppercase tracking-wider text-gold-400/50 mr-1">
                    {recipe.type}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); onEditRecipe(recipe) }}
                    className="p-1 text-white/30 hover:text-teal-400 transition-colors"
                    title="Edit recipe"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); if (confirm('Delete "' + recipe.name + '"?')) onDeleteRecipe(recipe.id) }}
                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
                    title="Delete recipe"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[0.7rem] text-warm-300/40">
                {recipe.servings && <span>Serves {recipe.servings}</span>}
                {recipe.prepTime && <span>· {recipe.prepTime}</span>}
                {recipe.cookTime && <span>· {recipe.cookTime}</span>}
              </div>
              {recipe.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="recipe-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-white/30 text-sm">
              No recipes found matching your search.
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Modal Overlay ───────────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {children}
    </div>
  )
}
