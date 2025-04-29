"use client";

import { Cocktail } from "@/types";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

export default function EditCocktailModal({
  onClose,
  onEdit,
  recipeToEdit,
}: {
  onClose: () => void;
  onEdit: (updated: Cocktail) => void;
  recipeToEdit: Cocktail;
}) {
  const [form, setForm] = useState<Cocktail>(recipeToEdit);

  useEffect(() => {
    setForm(recipeToEdit);
  }, [recipeToEdit]);

  const updateField = <K extends keyof Cocktail>(field: K, value: Cocktail[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof Cocktail, value: string) => {
    setForm((prev) => {
      const list = prev[field] as string[] | undefined;
      if (!list) return { ...prev, [field]: [value] };
      return list.includes(value)
        ? { ...prev, [field]: list.filter((v) => v !== value) }
        : { ...prev, [field]: [...list, value] };
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.method || form.ingredients.length === 0) return;
    onEdit(form);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4">
        <Dialog.Title className="text-xl font-bold">Edit Cocktail</Dialog.Title>

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

        <input
          placeholder="Method"
          className="border p-2 rounded w-full"
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

        <div>
          <p className="font-semibold text-sm mb-1">Allergens:</p>
          <div className="flex flex-wrap gap-2">
            {["nuts", "eggs", "dairy", "gluten"].map((a) => (
              <label key={a} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.allergens?.includes(a) ?? false}
                  onChange={() => toggleArrayField("allergens", a)}
                />
                <span className="capitalize">{a}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm mb-1">Seasons:</p>
          <div className="flex flex-wrap gap-2">
            {["spring", "summer", "fall", "winter"].map((s) => (
              <label key={s} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.seasons?.includes(s) ?? false}
                  onChange={() => toggleArrayField("seasons", s)}
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm mb-1">Liquor Types:</p>
          <div className="flex flex-wrap gap-2">
            {["vodka", "gin", "tequila", "rum", "whiskey", "mezcal", "brandy", "liqueur"].map((l) => (
              <label key={l} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.liquorTypes?.includes(l) ?? false}
                  onChange={() => toggleArrayField("liquorTypes", l)}
                />
                <span className="capitalize">{l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
