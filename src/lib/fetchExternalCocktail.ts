export async function fetchExternalCocktailFromGoogle(query: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_API_KEY!;
    const cx = process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_CX_ID!;
  
    if (!query.trim()) {
      throw new Error("Query is required.");
    }
  
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  
    const res = await fetch(searchUrl);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch external search results: ${err}`);
    }
  
    const data = await res.json();
    return data.items || [];
  }
  