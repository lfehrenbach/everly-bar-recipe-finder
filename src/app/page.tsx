"use client";

import type { Cocktail, Batch } from "@/types";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AddCocktailModal from "@/components/AddCocktailModal";
import { checkPassword } from "@/utils/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function Home() {
const [recipes, setRecipes] = useState<Cocktail[]>([]);
const [batches, setBatches] = useState<Batch[]>([]);
const [editingRecipe, setEditingRecipe] = useState<Cocktail | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");
  const [showBatches, setShowBatches] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [filterSweetness, setFilterSweetness] = useState("");
  const [filterAllergens, setFilterAllergens] = useState<string[]>([]);
  const [filterSeasons, setFilterSeasons] = useState<string[]>([]);
  const [filterLiquorTypes, setFilterLiquorTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cocktailData, error: cocktailError } = await supabase.from("cocktails").select("*");
      const { data: batchData, error: batchError } = await supabase.from("batches").select("*");

      if (cocktailError) {
        console.error("❌ Error fetching cocktails:", cocktailError);
      } else {
        setRecipes(cocktailData ?? []);
      }

      if (batchError) {
        console.error("❌ Error fetching batches:", batchError);
      } else {
        setBatches(batchData ?? []);
      }
    };

    fetchData();
  }, []);

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "sweetness") {
      const order = { dry: 1, "semi-dry": 2, balanced: 3, sweet: 4 };
      return (order[a.sweetness || "balanced"] ?? 0) - (order[b.sweetness || "balanced"] ?? 0);
    }
    if (sortOption === "liquorForward") {
      return (b.liquorForward ? 1 : 0) - (a.liquorForward ? 1 : 0);
    }
    return 0;
  });

  const filteredRecipes = sortedRecipes.filter((recipe) => {
    const matchesQuery =
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients?.some((ing: string) => ing.toLowerCase().includes(query.toLowerCase()));
    const matchesSweetness = !filterSweetness || recipe.sweetness === filterSweetness;
    const matchesAllergens =
      filterAllergens.length === 0 || !recipe.allergens?.some((a: string) => filterAllergens.includes(a));
    const matchesSeasons =
      filterSeasons.length === 0 || recipe.seasons?.some((s: string) => filterSeasons.includes(s));
    const matchesLiquorTypes =
      filterLiquorTypes.length === 0 || recipe.liquorTypes?.some((t: string) => filterLiquorTypes.includes(t));
    return matchesQuery && matchesSweetness && matchesAllergens && matchesSeasons && matchesLiquorTypes;
  });

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(query.toLowerCase()) ||
      batch.ingredients?.some((ing: string) => ing.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
<Toaster richColors position="top-center" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Everly Bar Recipe Finder</h1>

      {/* Top Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-6 justify-center sm:justify-start">
        <Button variant={!showBatches ? "default" : "outline"} onClick={() => setShowBatches(false)}>
          🍸 Cocktail Recipes
        </Button>
        <Button variant={showBatches ? "default" : "outline"} onClick={() => setShowBatches(true)}>
          🧪 Batch & Prep
        </Button>
        <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button
          onClick={async () => {
            const isAuthed = await checkPassword();
            if (isAuthed) setShowAddModal(true);
            else alert("Incorrect password.");
          }}
        >
          ➕ Add Cocktail
        </Button>
      </div>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder={showBatches ? "Search batch or ingredient..." : "Search cocktail or ingredient..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6"
      />

      {/* Filters */}
      {!showBatches && showFilters && (
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 text-sm items-center border rounded p-4 bg-white shadow-sm overflow-x-auto">
          {/* Sorting Dropdown */}
          <select className="border p-2 rounded" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort by...</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="sweetness">Sweetness Level</option>
            <option value="liquorForward">Strength</option>
          </select>

          {/* Sweetness Filter */}
          <select className="border p-2 rounded" value={filterSweetness} onChange={(e) => setFilterSweetness(e.target.value)}>
            <option value="">All Sweetness</option>
            <option value="dry">Dry</option>
            <option value="semi-dry">Semi-Dry</option>
            <option value="balanced">Balanced</option>
            <option value="sweet">Sweet</option>
          </select>

          {/* Filters (Allergens, Seasons, LiquorTypes) */}
          {["nuts", "eggs", "dairy", "gluten"].map((a) => (
            <label key={a} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterAllergens.includes(a)}
                onChange={() =>
                  setFilterAllergens((prev) =>
                    prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                  )
                }
              />
              <span className="capitalize">{a}</span>
            </label>
          ))}

          {["spring", "summer", "fall", "winter"].map((s) => (
            <label key={s} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterSeasons.includes(s)}
                onChange={() =>
                  setFilterSeasons((prev) =>
                    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                  )
                }
              />
              <span className="capitalize">{s}</span>
            </label>
          ))}

          {["vodka", "gin", "tequila", "rum", "whiskey", "mezcal", "brandy", "liqueur"].map((l) => (
            <label key={l} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterLiquorTypes.includes(l)}
                onChange={() =>
                  setFilterLiquorTypes((prev) =>
                    prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
                  )
                }
              />
              <span className="capitalize">{l}</span>
            </label>
          ))}

          {/* Clear Button */}
          <Button variant="outline" onClick={() => {
            setFilterSweetness("");
            setFilterAllergens([]);
            setFilterSeasons([]);
            setFilterLiquorTypes([]);
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Recipes and Batches List */}
      <div className="grid gap-4">
        {(showBatches ? filteredBatches : filteredRecipes).map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="p-4 pb-2">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="font-semibold">Ingredients:</p>
                <ul className="list-disc list-inside mb-2">
                  {item.ingredients?.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                </ul>
                <p><strong>Method:</strong> {item.method}</p>
                {item.garnish && <p><strong>Garnish:</strong> {item.garnish}</p>}
{/* Allergens */}
{item.allergens?.length > 0 && (
  <div className="mt-4 text-sm text-red-600 flex flex-wrap gap-2">
    ⚠️ Contains: {item.allergens.map((a: string, i: number) => (
      <span key={i}>
        {a === "nuts" ? "🥜 Nuts" :
         a === "eggs" ? "🥚 Eggs" :
         a === "dairy" ? "🥛 Dairy" :
         "🌾 Gluten"}
      </span>
    ))}
  </div>
)}

{/* Sweetness Scale */}
{item.sweetness && (
  <div className="mt-8">
    <div className="relative w-full max-w-xs h-5 bg-gray-200 rounded-full">
      <div
        className="absolute text-2xl transition-all duration-300"
        style={{
          top: "-2rem",
          left:
            item.sweetness === "dry" ? "7%" :
            item.sweetness === "semi-dry" ? "33%" :
            item.sweetness === "balanced" ? "66%" :
            item.sweetness === "sweet" ? "93%" : "50%",
          transform: "translateX(-50%)",
        }}
      >
        🍸
      </div>
      <div className="absolute top-6 w-full flex justify-between px-2 text-xs text-gray-500">
        <span>Dry</span><span>Semi-Dry</span><span>Balanced</span><span>Sweet</span>
      </div>
    </div>
  </div>
)}

{/* Seasons */}
{item.seasons?.length > 0 && (
  <div className="mt-9 text-sm text-blue-600 flex flex-wrap items-center gap-2">
    🌿 Season: {item.seasons.map((s: string, i: number) => (
      <span key={i}>
        {s === "spring" ? "🌸 Spring" :
         s === "summer" ? "☀️ Summer" :
         s === "fall" ? "🍂 Fall" :
         "❄️ Winter"}
      </span>
    ))}
  </div>
)}

{/* Liquor Types */}
{item.liquorTypes?.length > 0 && (
  <div className="mt-4 text-sm text-purple-600 flex items-center gap-2">
    🥃 <span className="font-semibold">Liquor:</span>{" "}
    {item.liquorTypes.map((l: string) => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}
  </div>
)}

                {/* Sweetness Scale, LiquorTypes, Allergens, Seasons (optional sections) */}
                {/* ... */}

                {/* Edit/Delete Dropdown */}
                <div className="mt-4 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {/* Edit */}
                      <DropdownMenuItem
                        onSelect={async () => {
                          const isAuthed = await checkPassword();
                          if (isAuthed) {
                            setEditingRecipe(item);
                            setShowAddModal(true);
                          }
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      {/* Delete */}
                      <DropdownMenuItem
                        onSelect={async () => {
                          const isAuthed = await checkPassword();
                          if (isAuthed) {
                            const confirmDelete = confirm(`Delete "${item.name}"?`);
                            if (confirmDelete) {
const { error } = await supabase
  .from("cocktails")
  .delete()
  .eq("id", item.id);

if (error) {
  console.error("❌ Error deleting cocktail:", error);
  toast.error("❌ Failed to delete cocktail!");
} else {
  setRecipes((prev) => prev.filter((r) => r.id !== item.id));
  toast.success(`Deleted "${item.name}" 🗑️`);
}

                            }
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddCocktailModal
          initialData={editingRecipe}
          onClose={() => {
            setShowAddModal(false);
            setEditingRecipe(null);
          }}
onAdd={async (newRecipe) => {
  try {
    if (editingRecipe) {
      const { error } = await supabase
        .from("cocktails")
        .update(newRecipe)
        .eq("id", editingRecipe.id);
      if (error) throw error;

      setRecipes((prev) =>
        prev.map((r) => (r.id === editingRecipe.id ? newRecipe : r))
      );
      toast.success(`Updated "${newRecipe.name}" 🍸`);
    } else {
      const { error } = await supabase.from("cocktails").insert([newRecipe]);
      if (error) throw error;

      setRecipes((prev) => [...prev, newRecipe]);
      toast.success(`Added "${newRecipe.name}" 🥂`);
    }
  } catch (error) {
const message = error instanceof Error ? error.message : JSON.stringify(error);
console.error("❌ Error saving cocktail:", message);
toast.error(`❌ Failed to save cocktail: ${message}`);

  } finally {
    setShowAddModal(false);
    setEditingRecipe(null);
  }
}}
        />
      )}
    </main>
  );
}


