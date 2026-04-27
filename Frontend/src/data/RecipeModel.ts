export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  cook_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  chef_name: string;
  created_at: string;
}

