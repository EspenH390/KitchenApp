const API_KEY = '01f72c80f8b843a388d0e91ec9e6d941'; // Bytt ut med din egen API-nøkkel
const BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Henter oppskrifter basert på en søketekst.
 * @param {string} query - Søketeksten (for eksempel "pasta", "tikka masala").
 * @returns {Promise<Array>} - En liste over oppskrifter.
 */
export const fetchRecipes = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/complexSearch?query=${query}&apiKey=${API_KEY}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Noe gikk galt med API-kallet');
    }

    return data.results; // Returnerer en liste over oppskrifter
  } catch (error) {
    console.error('Feil ved henting av oppskrifter:', error);
    throw error;
  }
};

/**
 * Henter detaljer for en spesifikk oppskrift.
 * @param {number} recipeId - ID-en til oppskriften.
 * @returns {Promise<Object>} - Oppskriftsdetaljer inkludert ingredienser og instruksjoner.
 */
export const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Noe gikk galt med API-kallet');
    }

    return data; // Returnerer detaljer om oppskriften
  } catch (error) {
    console.error('Feil ved henting av oppskriftsdetaljer:', error);
    throw error;
  }
};