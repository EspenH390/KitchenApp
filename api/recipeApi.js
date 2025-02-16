// api/recipeApi.js

export const fetchRecipes = async (ingredients) => {
    try {
      const response = await fetch(`https://some-recipe-api.com/search?ingredients=${ingredients}`);
      const data = await response.json();
      return data.recipes;
    } catch (error) {
      console.error("Feil ved henting av oppskrifter:", error);
      return [];
    }
  };
  