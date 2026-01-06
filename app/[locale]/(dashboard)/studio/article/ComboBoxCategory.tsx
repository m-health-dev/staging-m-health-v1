"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Plus, Trash2 } from "lucide-react";
import Avatar from "boring-avatars";
import { cn } from "@/lib/utils";
import LoadingComponent from "@/components/utility/loading-component";
import type { ArticleCategoryType } from "@/types/articles.types";
import { getAllArticleCategoryWithoutPagination } from "@/lib/article-category/get-article-category";

interface Props {
  readCategoryIds?: string[];
}

export function CategoryMultiSelectField({ readCategoryIds }: Props) {
  const form = useFormContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<ArticleCategoryType[]>([]);

  const categoryIds =
    useWatch({ name: "category", control: form.control }) || [];

  useEffect(() => {
    if (!categoryIds || categoryIds.length === 0) {
      form.setValue("category", [""], {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [categoryIds, form]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      const { data } = await getAllArticleCategoryWithoutPagination();
      setCategoryData(data);

      if (readCategoryIds?.length) {
        form.setValue("category", readCategoryIds, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }

      setLoading(false);
    };

    fetchCategories();
  }, [readCategoryIds, form]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     setLoading(true);
  //     const res = await getAllArticleCategoryWithoutPagination();
  //     setCategoryData(res.data);

  //     if (readCategoryIds?.length) {
  //       form.setValue("category", readCategoryIds, {
  //         shouldDirty: false,
  //         shouldValidate: true,
  //       });
  //     }
  //     // else if (categoryIds.length === 0) {
  //     //   form.setValue("category", [""]);
  //     // }

  //     setLoading(false);
  //   };

  //   fetchCategories();
  // }, [readCategoryIds]);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categoryData.slice(0, 10);
    return categoryData.filter((c) =>
      c.id_category.toLowerCase().includes(query.toLowerCase())
    );
  }, [categoryData, query]);

  const selectedCategories = useMemo(() => {
    return categoryData.filter((c) => categoryIds.includes(c.id_category));
  }, [categoryData, categoryIds]);

  const updateCategory = (index: number, id: string) => {
    const next = [...categoryIds];
    next[index] = id;
    form.setValue("category", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpenIndex(null);
  };

  const addCategory = () => {
    if (categoryIds.length >= 3) return;
    form.setValue("category", [...categoryIds, ""], {
      shouldDirty: true,
    });
  };

  const removeCategory = (index: number) => {
    const next = categoryIds.filter((_: any, i: number) => i !== index);
    form.setValue("category", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name="category"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel className="text-primary font-semibold!">
            Category
          </FormLabel>

          {categoryIds.map((categoryId: string, index: number) => {
            const category = categoryData.find((c) => c.id === categoryId);

            return (
              <div key={index} className="flex items-center gap-2">
                <Popover
                  open={openIndex === index}
                  onOpenChange={(open) => setOpenIndex(open ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="default"
                      disabled={loading}
                      className={cn(
                        "flex-1 h-12 rounded-2xl justify-between bg-white hover:ring-2 hover:ring-primary hover:bg-white focus:bg-white focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white text-primary!",
                        category && "text-primary font-semibold"
                      )}
                    >
                      {loading ? (
                        <LoadingComponent />
                      ) : category ? (
                        category.id_category
                      ) : (
                        "Pilih Category"
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Cari category..."
                        onValueChange={setQuery}
                      />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {filteredCategories.map((c) => (
                            <CommandItem
                              key={c.id}
                              value={c.id_category}
                              onSelect={() => updateCategory(index, c.id)}
                              disabled={categoryIds.includes(c.id)}
                            >
                              <Avatar
                                name={c.id_category}
                                size={20}
                                variant="beam"
                                className="mr-2"
                                colors={[
                                  "#3e77ab",
                                  "#22b26e",
                                  "#f2f26f",
                                  "#fff7bd",
                                  "#95cfb7",
                                ]}
                              />
                              {c.id_category}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {categoryIds.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-12 h-12 rounded-2xl"
                    onClick={() => removeCategory(index)}
                  >
                    <Trash2 />
                  </Button>
                )}

                {index === categoryIds.length - 1 && categoryIds.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-12 rounded-2xl bg-white"
                    onClick={addCategory}
                  >
                    <Plus />
                  </Button>
                )}
              </div>
            );
          })}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
