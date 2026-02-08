# Make Recipes Editable with Add/Remove

## Tasks
- [x] Add `updateRecipe` and `deleteRecipe` callbacks in `App()`
- [x] Add `editingRecipe` state in `App()`
- [x] Create `RecipeEditorModal` component (form for add/edit recipes)
- [x] Update `RecipeBrowserModal` - add "Add Recipe" button + edit/delete on cards
- [x] Update `RecipeModal` - add edit/delete buttons in header
- [x] Wire everything together: pass callbacks down through modals

## Review

All changes in a single file: `src/App.jsx`

### What changed:
1. **`updateRecipe(id, updatedRecipe)`** — updates a recipe in state and propagates name changes to any meal plan entries referencing it
2. **`deleteRecipe(id)`** — removes a recipe and nulls out its references in meal plans
3. **`editingRecipe` state** — `null` = closed, `'new'` = add mode, recipe object = edit mode
4. **`RecipeEditorModal`** — full form with fields: name, type (sahur/iftar), servings, prep/cook time, tags (comma-separated), ingredients (one per line), instructions (one per line). Reuses existing `ModalOverlay` and styling.
5. **`RecipeBrowserModal`** — now has an "Add Recipe" button in the header + edit/delete icon buttons on each recipe card (with `e.stopPropagation()` to avoid opening the recipe view)
6. **`RecipeModal`** — now has edit/delete buttons next to the close button in the header

All data persists to localStorage via existing `useEffect` hooks.
