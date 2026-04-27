import { Recipe } from "./RecipeModel";

export type ProfileUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  created_at?: string | null;
  preferences?: {
    skill_level?: string | null;
    dietary_preferences?: string[];
  };
  stats?: {
    bookmarks?: number;
    comments?: number;
    cooked_recipes?: number;
    created_recipes?: number;
    followers?: number;
    following?: number;
  };
  relationship?: {
    is_self?: boolean;
    can_follow?: boolean;
    is_following?: boolean;
  };
  followers_list?: ProfileUser[];
  following_list?: ProfileUser[];
  bookmarked_recipes?: Recipe[];
  cooked_recipes?: Recipe[];
  created_recipes?: Recipe[];
  recent_activity?: Array<{
    type: string;
    id: number;
    title: string;
    text?: string;
    rating?: number;
    created_at: string;
    recipe_id?: number;
    user_id?: number;
  }>;
};