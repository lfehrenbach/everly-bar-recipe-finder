// src/components/EditBatchModal.tsx

"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import type { Batch } from "@/types";

export default function EditBatchModal({
  onClose,
  onUpdate,
  initialData,
}: {
  onClose: () => void;
  onUpdate: (batch: Batch) => void;
  initialData: Batch;
}) {
  const [form, setForm] = useState<Batch>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const updateField = <K extends keyof Batch>(field: K, value: Batch[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || form.ingredients.length === 0 || !form.method) {
      alert("Please fill out Name, Ingredients, and Method!");
      return;
    }

    onUpdate({
      ...form,
      ingredients: form.ingredients.map((i) => i.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white p-6 rounded-lg max-w-lg w-full space-y-4 overflow-y-auto max-h-[90vh]">
        <Dialog.Title className="text-xl font-bold">
          Edit Batch
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
          rows={3}
          value={form.method}
          onChange={(e) => updateField("method", e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update Batch</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
