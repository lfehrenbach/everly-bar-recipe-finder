// lib/fetchExternalCocktail.ts

export async function fetchExternalCocktailFromGoogle(query: string) {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY!;
    const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX_ID!;
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;
  
    const res = await fetch(searchUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch external search results");
    }
  
    const data = await res.json();
    return data.items || [];
  }
  