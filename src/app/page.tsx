"use client";

import type { Cocktail, Batch } from "@/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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

function isCocktail(item: Cocktail | Batch): item is Cocktail {
  return "garnish" in item;
}

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
const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const { data: cocktailData } = await supabase.from("cocktails").select("*");
      const { data: batchData } = await supabase.from("batches").select("*");

      setRecipes(cocktailData ?? []);
      setBatches(batchData ?? []);
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
      recipe.ingredients?.some((ing) => ing.toLowerCase().includes(query.toLowerCase()));
    const matchesSweetness = !filterSweetness || recipe.sweetness === filterSweetness;
    const matchesAllergens =
      filterAllergens.length === 0 || !recipe.allergens?.some((a) => filterAllergens.includes(a));
    const matchesSeasons =
      filterSeasons.length === 0 || recipe.seasons?.some((s) => filterSeasons.includes(s));
    const matchesLiquorTypes =
      filterLiquorTypes.length === 0 || recipe.liquorTypes?.some((t) => filterLiquorTypes.includes(t));
    return matchesQuery && matchesSweetness && matchesAllergens && matchesSeasons && matchesLiquorTypes;
  });

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(query.toLowerCase()) ||
      batch.ingredients?.some((ing) => ing.toLowerCase().includes(query.toLowerCase()))
  );

return (
  <main className={`${darkMode ? "dark" : ""}`}>
    <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Everly Bar Recipe Finder</h1>

      {/* Controls */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-6 justify-center sm:justify-start">
        <Button variant={!showBatches ? "default" : "outline"} onClick={() => setShowBatches(false)}>🍸 Cocktail Recipes</Button>
        <Button variant={showBatches ? "default" : "outline"} onClick={() => setShowBatches(true)}>🧪 Batch & Prep</Button>
        <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button onClick={async () => {
          const isAuthed = await checkPassword();
          if (isAuthed) setShowAddModal(true);
          else alert("Incorrect password.");
        }}>➕ Add Cocktail</Button>
        <Button variant="outline" onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder={showBatches ? "Search batch or ingredient..." : "Search cocktail or ingredient..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6"
      />

      {/* Filters */}
      {!showBatches && showFilters && (
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 text-sm items-center border rounded p-4 bg-white dark:bg-gray-800 shadow-sm overflow-x-auto">
          {/* Sort Dropdown */}
          <select className="border p-2 rounded" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort by...</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="sweetness">Sweetness Level</option>
            <option value="liquorForward">Strength</option>
          </select>

          {/* Sweetness Dropdown */}
          <select className="border p-2 rounded" value={filterSweetness} onChange={(e) => setFilterSweetness(e.target.value)}>
            <option value="">All Sweetness</option>
            <option value="dry">Dry</option>
            <option value="semi-dry">Semi-Dry</option>
            <option value="balanced">Balanced</option>
            <option value="sweet">Sweet</option>
          </select>

          {/* Allergens */}
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

          {/* Seasons */}
          {["spring", "summer", "fall", "winter"].map((season) => (
            <label key={season} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={filterSeasons.includes(season)}
                onChange={() =>
                  setFilterSeasons((prev) =>
                    prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]
                  )
                }
              />
              <span className="capitalize">{season}</span>
            </label>
          ))}

          {/* Clear Filters Button */}
          <Button variant="outline" onClick={() => {
            setSortOption("");
            setFilterSweetness("");
            setFilterAllergens([]);
            setFilterSeasons([]);
            setFilterLiquorTypes([]);
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Recipe Cards */}
      <div className="grid gap-4">
        {(showBatches ? filteredBatches : filteredRecipes).map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Your card component content goes here... */}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddCocktailModal
          initialData={editingRecipe ?? undefined}
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
                const newRecipeCopy = { ...newRecipe };
                Reflect.deleteProperty(newRecipeCopy, "id");

                const { data, error } = await supabase
                  .from("cocktails")
                  .insert([newRecipeCopy])
                  .select()
                  .single();

                if (error) throw error;

                setRecipes((prev) => [...prev, data]);
                toast.success(`Added "${newRecipe.name}" 🥂`);
              }
            } catch (error) {
              const message =
                error instanceof Error ? error.message : JSON.stringify(error);
              console.error("❌ Error saving cocktail:", message);
              toast.error(`❌ Failed to save cocktail: ${message}`);
            } finally {
              setShowAddModal(false);
              setEditingRecipe(null);
            }
          }}
        />
      )}
    </div>
  </main>
);