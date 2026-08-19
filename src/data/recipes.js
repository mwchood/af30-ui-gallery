import { assetPath } from '../assetPath';

export const recipeLibrary = [
  { id: 'green-beans', name: 'Air Fryer Green Beans', meta: 'Air Fry · 30 min', image: assetPath(''), category: 'Vegetables' },
  { id: 'crispy-wings', name: 'Crispy Air Fryer Chicken Wings', meta: 'Air Fry · 34 min', image: assetPath(''), category: 'Chicken' },
  { id: 'chicken-breast', name: 'Juicy Air Fryer Chicken Breast', meta: 'Roast · 28 min', image: assetPath(''), category: 'Chicken' },
  { id: 'popcorn-chicken', name: 'Air Fryer Popcorn Chicken', meta: 'Air Fry · 24 min', image: assetPath(''), category: 'Chicken' },
  { id: 'chicken-skewers', name: 'Air Fryer Chicken Skewers', meta: 'Air Fry · 26 min', image: assetPath(''), category: 'Chicken' },
  { id: 'teriyaki-thighs', name: 'Teriyaki Air Fryer Chicken Thighs', meta: 'Air Fry · 30 min', image: assetPath(''), category: 'Chicken' },
  { id: 'lemon-herb', name: 'Lemon Herb Air Fryer Chicken', meta: 'Roast · 32 min', image: assetPath(''), category: 'Chicken' },
  { id: 'pepper-potatoes', name: 'Crispy Pepper Potatoes', meta: 'Air Fry · 22 min', image: assetPath(''), category: 'Potato' },
  { id: 'garlic-pumpkin', name: 'Garlic Roasted Pumpkin', meta: 'Roast · 25 min', image: assetPath(''), category: 'Vegetables' },
  { id: 'parmesan-potatoes', name: 'Parmesan Potato Bites', meta: 'Air Fry · 20 min', image: assetPath(''), category: 'Potato' },
  { id: 'crispy-vegetables', name: 'Crispy Mixed Vegetables', meta: 'Air Fry · 18 min', image: assetPath(''), category: 'Vegetables' },
  { id: 'roasted-green-beans', name: 'Roasted Garlic Green Beans', meta: 'Roast · 16 min', image: assetPath(''), category: 'Vegetables' },
];

export const recipeCategories = [
  ['All', 12, 'book'],
  ['Potato', 2, 'food'],
  ['Chicken', 6, 'poultry'],
  ['Vegetables', 4, 'food'],
];

export const greenBeansRecipe = {
  id: 'green-beans',
  name: 'Air Fryer Green Beans',
  image: assetPath(''),
  cameraImage: assetPath(''),
  description: 'Toss green beans with olive oil, salt, and pepper. Air-fry until lightly charred and crispy, then finish with a savory parmesan bread crumb mixture.',
  facts: [
    ['Serving', '2'],
    ['Total time', '30 min'],
    ['Prep time', '20 min'],
    ['Difficulty', 'Easy'],
  ],
  equipment: ['Typhur Sync Air Fryer', 'Tongs', 'Bowl', 'Chef knife'],
  ingredients: [
    ['Green Beans (rinsed, trimmed and patted dry)', '454 g'],
    ['Olive Oil', '14 g'],
    ['Kosher Salt', '1 g'],
    ['Garlic Clove (minced)', '2'],
    ['Parmesan Cheese, grated', '20 g'],
    ['Bread Crumbs', '12 g'],
    ['Paprika', '2 g'],
    ['Dried Parsley', '1 g'],
    ['Black Pepper, freshly cracked', '10 turns'],
  ],
  steps: [
    { title: 'Prepare the Bread Crumb Mixture', body: 'In a small bowl, combine the Parmesan cheese, bread crumbs, garlic, salt, paprika, parsley, black pepper, and oil. Stir to combine.', material: '20 g Parmesan · 12 g bread crumbs · 2 garlic cloves · 1 g salt · 2 g paprika · 1 g parsley · 10 turns black pepper', tool: 'Bowl' },
    { title: 'Seasoning the Beans', body: 'In a large bowl, combine green beans, olive oil, and salt. Stir well.', material: '454 g green beans · 14 g olive oil · 1 g kosher salt' },
    { title: 'Add the Green Beans', body: 'Carefully add the green beans to the basket. Place the basket back into the air fryer.' },
    { title: 'Cook the Green Beans', body: 'Cook the green beans using the first cooking stage.', cook: { mode: 'Air Fry', temperature: 190, time: 7, fan: 5 } },
    { title: 'Add Bread Crumb Mixture to Green Beans', body: 'Open the air fryer basket and sprinkle the bread crumbs evenly over the green beans, then spray with olive oil spray.' },
    { title: 'Cook the Green Beans Again', body: 'Cook the green beans again to crisp the parmesan bread crumb topping.', cook: { mode: 'Air Fry', temperature: 190, time: 3, fan: 5 } },
    { title: 'Remove the Green Beans', body: 'Using tongs, carefully remove the green beans from the air fryer to a plate or serving tray.' },
    { title: 'Serve and Enjoy!', body: 'Serve immediately while the green beans and parmesan topping are crisp.' },
  ],
  settings: { mode: 'Air Fry', temperature: 190, time: 7, fan: 5 },
};

export const crispyWingsRecipe = {
  id: 'crispy-wings',
  name: 'Crispy Air Fryer Chicken Wings',
  image: assetPath(''),
  cameraImage: assetPath(''),
  description: 'Season chicken wings with spices, then air-fry until the skin is crisp and the center stays juicy.',
  facts: [
    ['Serving', '4'],
    ['Total time', '34 min'],
    ['Prep time', '20 min'],
    ['Difficulty', 'Easy'],
  ],
  equipment: ['Typhur Sync Air Fryer', 'Tongs', 'Mixing bowl', 'Chef knife'],
  ingredients: [
    ['Chicken wings', '907 g'],
    ['Garlic powder', '4 g'],
    ['Onion powder', '3 g'],
    ['Paprika', '1 g'],
    ['Dried oregano', '1 g'],
    ['Chili flakes', '1 g'],
    ['Kosher salt', '1.5 g'],
    ['Black pepper', '1 g'],
    ['Olive oil', '28 g'],
    ['Worcester sauce', '4 g'],
  ],
  steps: [
    { title: 'Prepare the Chicken Wings', body: 'If needed, separate the drumettes from the flats using a knife or kitchen scissors.', material: 'Chicken wings · 907 g', tool: 'Chef knife' },
    { title: 'Prepare the Seasoning', body: 'Combine the dry seasoning, salt and pepper in a mixing bowl.', material: 'Dry seasoning', tool: 'Mixing bowl' },
    { title: 'Season the Chicken Wings', body: 'Coat every wing evenly with oil, Worcestershire sauce and the seasoning mixture.', material: 'Seasoning mixture', tool: 'Mixing bowl · Tongs' },
    { title: 'Add the Chicken Wings', body: 'Arrange the wings in one layer with space between pieces for even airflow.', material: 'Seasoned chicken wings', tool: 'Air fryer basket' },
    { title: 'Cook the Chicken Wings', body: 'Cook the chicken wings using the recipe settings.', material: 'Chicken wings', tool: 'Typhur Sync Air Fryer' },
    { title: 'Remove the Chicken Wings', body: 'Carefully remove the cooked wings and let excess heat escape.', material: 'Cooked chicken wings', tool: 'Tongs' },
    { title: 'Serve and Enjoy', body: 'Rest briefly, then serve while the skin is still crisp.', material: 'Crispy chicken wings', tool: 'Serving plate' },
  ],
  settings: { mode: 'Air Fry', temperature: 190, time: 14, fan: 5 },
};

export const recipesById = {
  'green-beans': greenBeansRecipe,
  'crispy-wings': crispyWingsRecipe,
};

