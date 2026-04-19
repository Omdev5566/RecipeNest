export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  chef: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  recipeCount: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Breakfast', description: 'Start your day right', recipeCount: 24 },
  { id: '2', name: 'Lunch', description: 'Midday meals', recipeCount: 38 },
  { id: '3', name: 'Dinner', description: 'Evening delights', recipeCount: 45 },
  { id: '4', name: 'Desserts', description: 'Sweet treats', recipeCount: 32 },
  { id: '5', name: 'Vegetarian', description: 'Plant-based recipes', recipeCount: 28 },
  { id: '6', name: 'Quick Meals', description: 'Ready in 30 minutes', recipeCount: 41 },
];

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A timeless Italian classic with fresh mozzarella, basil, and tomato sauce on a crispy crust.',
    image: 'https://images.unsplash.com/photo-1707896543317-da87bde75ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMGJhc2lsfGVufDF8fHx8MTc3MTQ1NTkwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dinner',
    cookTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '500g pizza dough',
      '200g fresh mozzarella',
      '150ml tomato sauce',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat your oven to 475°F (245°C).',
      'Roll out the pizza dough on a floured surface.',
      'Spread tomato sauce evenly over the dough.',
      'Add torn mozzarella and drizzle with olive oil.',
      'Bake for 12-15 minutes until crust is golden.',
      'Top with fresh basil leaves and serve immediately.'
    ],
    chef: 'Marco Rossi',
    createdAt: '2026-02-10'
  },
  {
    id: '2',
    title: 'Avocado Toast with Poached Egg',
    description: 'A healthy and delicious breakfast featuring creamy avocado and perfectly poached eggs.',
    image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdG9hc3QlMjBwb2FjaGVkJTIwZWdnfGVufDF8fHx8MTc3MTQyNTg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Breakfast',
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 eggs',
      'Lemon juice',
      'Red pepper flakes',
      'Salt and black pepper'
    ],
    instructions: [
      'Toast the bread slices until golden brown.',
      'Mash avocado with lemon juice, salt, and pepper.',
      'Bring water to a gentle simmer and poach eggs for 3-4 minutes.',
      'Spread avocado mixture on toast.',
      'Top with poached eggs and sprinkle with red pepper flakes.',
      'Serve immediately while eggs are warm.'
    ],
    chef: 'Sarah Johnson',
    createdAt: '2026-02-12'
  },
  {
    id: '3',
    title: 'Thai Green Curry',
    description: 'Aromatic and spicy Thai curry with vegetables and coconut milk.',
    image: 'https://images.unsplash.com/photo-1638517307486-4c2ae5c45764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZ3JlZW4lMjBjdXJyeSUyMGNvY29udXR8ZW58MXx8fHwxNzcxNDE3OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dinner',
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '3 tbsp green curry paste',
      '400ml coconut milk',
      '300g mixed vegetables',
      '200g tofu or chicken',
      'Thai basil leaves',
      'Fish sauce',
      'Brown sugar',
      'Lime juice'
    ],
    instructions: [
      'Heat oil in a large pan and fry curry paste for 1 minute.',
      'Add coconut milk and bring to a simmer.',
      'Add vegetables and protein, cook for 15 minutes.',
      'Season with fish sauce, sugar, and lime juice.',
      'Add Thai basil leaves just before serving.',
      'Serve with jasmine rice.'
    ],
    chef: 'Ploy Suwan',
    createdAt: '2026-02-08'
  },
  {
    id: '4',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a molten center.',
    image: 'https://images.unsplash.com/photo-1762631934519-291bf80c3f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBsYXZhJTIwY2FrZSUyMG1vbHRlbnxlbnwxfHx8fDE3NzE0NDQyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Desserts',
    cookTime: 20,
    servings: 4,
    difficulty: 'Hard',
    ingredients: [
      '100g dark chocolate',
      '100g butter',
      '2 eggs',
      '2 egg yolks',
      '50g sugar',
      '30g flour',
      'Vanilla extract',
      'Butter for greasing'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C). Grease ramekins with butter.',
      'Melt chocolate and butter together.',
      'Whisk eggs, yolks, and sugar until thick.',
      'Fold in melted chocolate and flour.',
      'Pour into ramekins and bake for 12 minutes.',
      'Let cool for 1 minute, then invert onto plates. Serve immediately.'
    ],
    chef: 'Pierre Dubois',
    createdAt: '2026-02-15'
  },
  {
    id: '5',
    title: 'Caesar Salad',
    description: 'Crisp romaine lettuce with classic Caesar dressing and parmesan.',
    image: 'https://images.unsplash.com/photo-1722032617357-7b09276b1a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhZXNhciUyMHNhbGFkJTIwcGxhdGV8ZW58MXx8fHwxNzcxNDkwMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Lunch',
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 large romaine lettuce',
      '100g parmesan cheese',
      '2 cups croutons',
      '3 anchovy fillets',
      '2 garlic cloves',
      '1 egg yolk',
      'Lemon juice',
      '150ml olive oil',
      'Worcestershire sauce'
    ],
    instructions: [
      'Wash and chop romaine lettuce into bite-sized pieces.',
      'Blend anchovy, garlic, egg yolk, and lemon juice.',
      'Slowly add olive oil while blending until creamy.',
      'Add Worcestershire sauce to taste.',
      'Toss lettuce with dressing.',
      'Top with croutons and shaved parmesan.'
    ],
    chef: 'Julia Martinez',
    createdAt: '2026-02-14'
  },
  {
    id: '6',
    title: 'Quinoa Buddha Bowl',
    description: 'Nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.',
    image: 'https://images.unsplash.com/photo-1679279726937-122c49626802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBidWRkaGElMjBib3dsJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NzE0OTAyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Vegetarian',
    cookTime: 40,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '200g quinoa',
      '1 sweet potato',
      '1 cup chickpeas',
      '2 cups kale',
      '1 avocado',
      'Tahini',
      'Lemon juice',
      'Olive oil',
      'Spices: cumin, paprika'
    ],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Roast sweet potato and chickpeas with spices at 400°F for 25 minutes.',
      'Massage kale with olive oil and lemon juice.',
      'Make tahini dressing by mixing tahini, lemon juice, and water.',
      'Assemble bowl with quinoa, roasted vegetables, kale, and avocado.',
      'Drizzle with tahini dressing and serve.'
    ],
    chef: 'Emma Green',
    createdAt: '2026-02-11'
  },
  {
    id: '7',
    title: '15-Minute Shrimp Stir Fry',
    description: 'Quick and flavorful stir fry perfect for busy weeknights.',
    image: 'https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBzdGlyJTIwZnJ5JTIwYXNpYW58ZW58MXx8fHwxNzcxNDkwMjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Quick Meals',
    cookTime: 15,
    servings: 3,
    difficulty: 'Easy',
    ingredients: [
      '400g shrimp',
      '2 cups mixed vegetables',
      '3 tbsp soy sauce',
      '2 tbsp oyster sauce',
      '2 garlic cloves',
      '1 tbsp ginger',
      'Sesame oil',
      'Green onions'
    ],
    instructions: [
      'Heat sesame oil in a wok over high heat.',
      'Add garlic and ginger, stir fry for 30 seconds.',
      'Add shrimp and cook for 2-3 minutes until pink.',
      'Add vegetables and stir fry for 3-4 minutes.',
      'Pour in soy sauce and oyster sauce, toss to combine.',
      'Garnish with green onions and serve over rice.'
    ],
    chef: 'Kevin Chen',
    createdAt: '2026-02-16'
  },
  {
    id: '8',
    title: 'Blueberry Pancakes',
    description: 'Fluffy pancakes bursting with fresh blueberries.',
    image: 'https://images.unsplash.com/photo-1619592982366-ed3d55927817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlYmVycnklMjBwYW5jYWtlcyUyMGJyZWFrZmFzdCUyMHN5cnVwfGVufDF8fHx8MTc3MTQ5MDI1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Breakfast',
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '2 cups flour',
      '2 tbsp sugar',
      '2 tsp baking powder',
      '1/2 tsp salt',
      '2 eggs',
      '1.5 cups milk',
      '4 tbsp melted butter',
      '1 cup fresh blueberries'
    ],
    instructions: [
      'Mix dry ingredients in a large bowl.',
      'Whisk eggs, milk, and melted butter in another bowl.',
      'Combine wet and dry ingredients until just mixed.',
      'Gently fold in blueberries.',
      'Cook on a greased griddle until bubbles form, then flip.',
      'Serve with maple syrup and extra blueberries.'
    ],
    chef: 'Sarah Johnson',
    createdAt: '2026-02-13'
  }
];