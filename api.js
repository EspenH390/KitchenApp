// api.js
import axios from 'axios';

const API_KEY = 'DIN_API_NØKKEL'; // 🔹 Sett inn din API-nøkkel her
const BASE_URL = 'https://api.mrcook.app/v1'; // 🔹 Sørg for at denne er riktig

// Funksjon for å hente oppskrift basert på ingredienser
export const generateRecipe = async (ingredients) => {
  try {
    console.log('📡 Sender API-kall med ingredienser:', ingredients); // Debugging
    const response = await axios.post(
      `${BASE_URL}/recipes/generate`,
      {
        ingredients: ingredients,
        language: 'no', // 🔹 Språk: norsk
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ API-svar:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error('❌ Feil ved henting av oppskrift:', error.response?.data || error.message);
    throw error;
  }
};
