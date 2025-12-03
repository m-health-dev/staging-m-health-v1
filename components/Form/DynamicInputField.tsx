"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  form: any;
  name: string;
  label: string;
}

export function DynamicInputField({ form, name, label }: Props) {
  const values = form.watch(name) || [];

  // 👉 Saat pertama kali render, kalau empty, langsung buka 1 input.
  useEffect(() => {
    if (values.length === 0) {
      form.setValue(name, [""]);
    }
  }, [values, form, name]);

  const addField = () => {
    form.setValue(name, [...values, ""]);
  };

  const updateField = (index: number, value: string) => {
    const newArr = [...values];
    newArr[index] = value;
    form.setValue(name, newArr);
  };

  const removeField = (index: number) => {
    const newArr = values.filter((_: any, i: number) => i !== index);
    form.setValue(name, newArr);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel className="text-primary font-semibold!">{label}</FormLabel>

          <div className="space-y-3">
            {values.map((val: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <FormControl>
                  <Input
                    value={val}
                    onChange={(e) => updateField(idx, e.target.value)}
                    placeholder="Type something..."
                    className="h-12"
                  />
                </FormControl>

                {values.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-12 h-12 rounded-2xl"
                    onClick={() => removeField(idx)}
                  >
                    <Trash2 />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl w-12 h-12"
                  onClick={addField}
                >
                  <Plus />
                </Button>
              </div>
            ))}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
