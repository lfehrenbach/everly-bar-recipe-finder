"use client";

import type { Cocktail, Batch } from "@/types";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AddCocktailModal from "@/components/AddCocktailModal";
import AddBatchModal from "@/components/AddBatchModal";
import EditBatchModal from "@/components/EditBatchModal";
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
const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
const [showAddBatchModal, setShowAddBatchModal] = useState(false);
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
    <main className={darkMode ? "dark" : ""}>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen transition-colors duration-300">
        <Toaster richColors position="top-center" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Everly Bar Recipe Finder</h1>

        {/* Controls */}
<div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-6 justify-center sm:justify-start">
  <Button variant={!showBatches ? "default" : "outline"} onClick={() => setShowBatches(false)}>🍸 Cocktail Recipes</Button>
  <Button variant={showBatches ? "default" : "outline"} onClick={() => setShowBatches(true)}>🧪 Batch & Prep</Button>
  <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setShowFilters((prev) => !prev)}>
    {showFilters ? "Hide Filters" : "Show Filters"}
  </Button>
  <Button variant="outline" onClick={() => setDarkMode((prev) => !prev)}>
    {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
  </Button>
  <Button
    onClick={async () => {
      const isAuthed = await checkPassword();
      if (isAuthed) {
        if (showBatches) {
          setShowAddBatchModal(true);
        } else {
          setShowAddModal(true);
        }
      } else {
        alert("Incorrect password.");
      }
    }}
  >
    ➕ Add {showBatches ? "Batch" : "Cocktail"}
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
  <div className="flex flex-wrap gap-4 mb-6 text-sm items-center border rounded p-4 bg-white dark:bg-gray-800 shadow-sm overflow-x-auto">
    {/* Sort Dropdown */}
    <label className="flex flex-col">
      <span className="mb-1 font-medium">Sort</span>
      <select
        className="border p-2 rounded bg-white dark:bg-gray-900"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Sort by...</option>
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
        <option value="sweetness">Sweetness Level</option>
        <option value="liquorForward">Strength</option>
      </select>
    </label>

    {/* Sweetness Dropdown */}
    <label className="flex flex-col">
      <span className="mb-1 font-medium">Sweetness</span>
      <select
        className="border p-2 rounded bg-white dark:bg-gray-900"
        value={filterSweetness}
        onChange={(e) => setFilterSweetness(e.target.value)}
      >
        <option value="">All Sweetness</option>
        <option value="dry">Dry</option>
        <option value="semi-dry">Semi-Dry</option>
        <option value="balanced">Balanced</option>
        <option value="sweet">Sweet</option>
      </select>
    </label>

    {/* Allergens */}
    <fieldset className="flex flex-col gap-1">
      <span className="font-medium">Allergens</span>
      {["nuts", "eggs", "dairy", "gluten"].map((a) => (
        <label key={a} className="flex items-center gap-1">
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
    </fieldset>

    {/* Seasons */}
    <fieldset className="flex flex-col gap-1">
      <span className="font-medium">Seasons</span>
      {["spring", "summer", "fall", "winter"].map((season) => (
        <label key={season} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filterSeasons.includes(season)}
            onChange={() =>
              setFilterSeasons((prev) =>
                prev.includes(season)
                  ? prev.filter((s) => s !== season)
                  : [...prev, season]
              )
            }
          />
          <span className="capitalize">{season}</span>
        </label>
      ))}
    </fieldset>

    {/* Clear Filters Button */}
    <Button
      variant="outline"
      onClick={() => {
        setSortOption("");
        setFilterSweetness("");
        setFilterAllergens([]);
        setFilterSeasons([]);
        setFilterLiquorTypes([]);
      }}
    >
      Clear Filters
    </Button>
  </div>
)}


        {/* Recipe Cards */}
        <div className="grid gap-4">
          {(showBatches ? filteredBatches : filteredRecipes).map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardContent className="p-4 pb-2">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="font-semibold">Ingredients:</p>
                  <ul className="list-disc list-inside mb-2">
                    {item.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                  <p><strong>Method:</strong> {item.method}</p>

                  {/* Garnish */}
                  {isCocktail(item) && item.garnish && <p><strong>Garnish:</strong> {item.garnish}</p>}

                  {/* Allergen section */}
                  {isCocktail(item) && Array.isArray(item.allergens) && item.allergens.length > 0 && (
                    <div className="mt-4 text-sm text-red-600 flex flex-wrap gap-2">
                      ⚠️ Contains:{" "}
                      {item.allergens.map((a, i) => (
                        <span key={i}>
                          {a === "nuts" ? "🥜 Nuts" : a === "eggs" ? "🥚 Eggs" : a === "dairy" ? "🥛 Dairy" : "🌾 Gluten"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sweetness Meter */}
                  {isCocktail(item) && item.sweetness && (
                    <div className="mt-9">
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

                  {/* Liquor Types */}
                  {isCocktail(item) && Array.isArray(item.liquorTypes) && item.liquorTypes.length > 0 && (
                    <div className="mt-8 text-sm text-purple-600 flex items-center gap-2">
                      🥃 <span className="font-semibold">Liquor:</span>{" "}
                      {item.liquorTypes.map((l) => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}
                    </div>
                  )}

                  {/* Seasons */}
                  {isCocktail(item) && Array.isArray(item.seasons) && item.seasons.length > 0 && (
                    <div className="mt-4 text-sm text-blue-600 flex flex-wrap items-center gap-2">
                      🌿 Season:{" "}
                      {item.seasons.map((s, i) => (
                        <span key={i}>
                          {s === "spring" ? "🌸 Spring" : s === "summer" ? "☀️ Summer" : s === "fall" ? "🍂 Fall" : "❄️ Winter"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Edit/Delete */}
                  <div className="mt-4 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
<DropdownMenuItem
  onSelect={async () => {
    const isAuthed = await checkPassword();
    if (isAuthed) {
      setEditingBatch(item);
    }
  }}
>
  <Pencil className="mr-2 h-4 w-4" /> Edit
</DropdownMenuItem>

<DropdownMenuItem
  onSelect={async () => {
    const isAuthed = await checkPassword();
    if (isAuthed) {
      const confirmDelete = confirm(`Delete "${item.name}"?`);
      if (confirmDelete) {
        const { error } = await supabase.from("batches").delete().eq("id", item.id);
        if (error) toast.error("❌ Failed to delete batch!");
        else {
          setBatches((prev) => prev.filter((b) => b.id !== item.id));
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
          setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? newRecipe : r)));
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
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        toast.error(`❌ Failed to save cocktail: ${message}`);
      } finally {
        setShowAddModal(false);
        setEditingRecipe(null);
      }
    }}
  />
)}

{showAddBatchModal && (
  <AddBatchModal
    initialData={editingBatch ?? undefined}
    onClose={() => {
      setShowAddBatchModal(false);
      setEditingBatch(null);
    }}
    onAdd={async (newBatch) => {
      try {
        const newBatchCopy = { ...newBatch };
        Reflect.deleteProperty(newBatchCopy, "id");
        const { data, error } = await supabase
          .from("batches")
          .insert([newBatchCopy])
          .select()
          .single();
        if (error) throw error;
        setBatches((prev) => [...prev, data]);
        toast.success(`Added "${newBatch.name}" 🧪`);
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        toast.error(`❌ Failed to save batch: ${message}`);
      } finally {
        setShowAddBatchModal(false);
        setEditingBatch(null);
      }
    }}
  />
)}

{editingBatch && !showAddBatchModal && (
  <EditBatchModal
    initialData={editingBatch}
    onClose={() => setEditingBatch(null)}
    onUpdate={async (updatedBatch) => {
      try {
        const { error } = await supabase
          .from("batches")
          .update(updatedBatch)
          .eq("id", updatedBatch.id);
        if (error) throw error;
        setBatches((prev) =>
          prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
        );
        toast.success(`Updated "${updatedBatch.name}" 🧪`);
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        toast.error(`❌ Failed to update batch: ${message}`);
      } finally {
        setEditingBatch(null);
      }
    }}
  />
)}
      </div>
    </main>
  );
}
