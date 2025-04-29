"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

import { Cocktail } from "@/types"; // ✅ Correct import

export default function AddCocktailModal({
  onClose,
  onAdd,
  initialData,
}: {
  onClose: () => void;
  onAdd: (recipe: Cocktail) => void;
  initialData?: Cocktail;
}) {
const [form, setForm] = useState<Cocktail>(
  initialData ?? {
    id: 0,  // <-- set id to 0 (a number!)
    name: "",
    ingredients: [],
    method: "",
    garnish: "",
    sweetness: undefined,
    liquorForward: false,
    allergens: [],
    seasons: [],
    liquorTypes: [],
  }
);

  const updateField = <K extends keyof Cocktail>(field: K, value: Cocktail[K]) => {
  setForm((prev) => ({ ...prev, [field]: value }));
};


  const handleCheckboxChange = (field: keyof Cocktail) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setForm((prev) => {
      const list = (prev[field] as string[]) ?? [];
      const updated = checked
        ? [...list, value]
        : list.filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = () => {
    if (!form.name || form.ingredients.length === 0 || !form.method) {
      alert("Please fill out Name, Ingredients, and Method!");
      return;
    }
    onAdd({
      ...form,
      ingredients: form.ingredients.map((i) => i.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4 overflow-y-auto max-h-[90vh]">
        <Dialog.Title className="text-xl font-bold">
          {initialData ? "Edit Cocktail" : "Add New Cocktail"}
        </Dialog.Title>

        <input
          placeholder="Name"
          className="border p-2 rounded w-full"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <textarea
          placeholder="Ingredients (one per line)"
          className="border p-2 rounded w-full"
          rows={4}
          value={form.ingredients.join("\n")}
          onChange={(e) => updateField("ingredients", e.target.value.split("\n"))}
        />

        <textarea
          placeholder="Method"
          className="border p-2 rounded w-full"
          rows={2}
          value={form.method}
          onChange={(e) => updateField("method", e.target.value)}
        />

        <input
          placeholder="Garnish"
          className="border p-2 rounded w-full"
          value={form.garnish}
          onChange={(e) => updateField("garnish", e.target.value)}
        />

<select
  className="border p-2 rounded w-full"
  value={form.sweetness ?? ""}
  onChange={(e) => {
    const val = e.target.value as "dry" | "semi-dry" | "balanced" | "sweet" | "";
    updateField("sweetness", val === "" ? undefined : val);
  }}
>
  <option value="">Select Sweetness</option>
  <option value="dry">Dry</option>
  <option value="semi-dry">Semi-Dry</option>
  <option value="balanced">Balanced</option>
  <option value="sweet">Sweet</option>
</select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.liquorForward || false}
            onChange={(e) => updateField("liquorForward", e.target.checked)}
          />
          Liquor Forward
        </label>

        {/* Allergens */}
        <div className="mt-4">
          <p className="font-semibold text-sm mb-1">Allergens:</p>
          <div className="flex flex-wrap gap-4">
            {["nuts", "eggs", "dairy", "gluten"].map((a) => (
              <label key={a} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={a}
                  checked={form.allergens.includes(a)}
                  onChange={handleCheckboxChange("allergens")}
                />
                <span className="capitalize">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Seasons */}
        <div className="mt-4">
          <p className="font-semibold text-sm mb-1">Seasons:</p>
          <div className="flex flex-wrap gap-4">
            {["spring", "summer", "fall", "winter"].map((s) => (
              <label key={s} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={s}
                  checked={form.seasons.includes(s)}
                  onChange={handleCheckboxChange("seasons")}
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Liquor Types */}
        <div className="mt-4">
          <p className="font-semibold text-sm mb-1">Liquor Types:</p>
          <div className="flex flex-wrap gap-4">
            {["vodka", "gin", "tequila", "rum", "whiskey", "mezcal", "brandy", "liqueur"].map((l) => (
              <label key={l} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  value={l}
                  checked={form.liquorTypes.includes(l)}
                  onChange={handleCheckboxChange("liquorTypes")}
                />
                <span className="capitalize">{l}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update Cocktail" : "Add Cocktail"}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

