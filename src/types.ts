export type Cocktail = {
    id: number;
    name: string;
    ingredients: string[];
    method: string;
    garnish?: string;
    sweetness?: "dry" | "semi-dry" | "balanced" | "sweet";
    liquorForward?: boolean;
    liquorTypes?: string[];
    allergens?: string[];
    seasons?: string[];
  };
  
  export type Batch = {
    id: number;
    name: string;
    ingredients: string[];
    method: string;
  };
  