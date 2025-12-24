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
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Plus, Trash2 } from "lucide-react";
import Avatar from "boring-avatars";
import { cn } from "@/lib/utils";
import LoadingComponent from "@/components/utility/loading-component";
import { getAllArticleAuthorWithoutPagination } from "@/lib/article-author/get-article-author";
import { ArticleAuthorType, ArticleCategoryType } from "@/types/articles.types";
import { getAllArticleCategoryWithoutPagination } from "@/lib/article-category/get-article-category";

interface Props {
  readCategoryIds?: string[];
}

export function CategoryMultiSelectField({ readCategoryIds }: Props) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<ArticleCategoryType[]>([]);

  const categoryIds =
    useWatch({ name: "category_ids", control: form.control }) || [];

  // fetch Category + handle update mode
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const res = await getAllArticleCategoryWithoutPagination();
      setCategoryData(res.data);

      if (readCategoryIds?.length) {
        form.setValue("category_ids", readCategoryIds, {
          shouldDirty: false,
          shouldValidate: true,
        });
      } else if (categoryIds.length === 0) {
        // create mode → buka 1 slot
        form.setValue("category_ids", [""]);
      }

      setLoading(false);
    };

    fetchCategories();
  }, [readCategoryIds]);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categoryData.slice(0, 10);
    return categoryData.filter((a) =>
      a.id_category.toLowerCase().includes(query.toLowerCase())
    );
  }, [categoryData, query]);

  const selectedCategories = useMemo(() => {
    return categoryData.filter((a) => categoryIds.includes(a.id_category));
  }, [categoryData, categoryIds]);

  const updateCategory = (index: number, id: string) => {
    const next = [...categoryIds];
    next[index] = id;
    form.setValue("category_ids", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };

  const addCategory = () => {
    if (categoryIds.length >= 3) return;
    form.setValue("category_ids", [...categoryIds, ""], {
      shouldDirty: true,
    });
  };

  const removeCategory = (index: number) => {
    const next = categoryIds.filter((_: any, i: number) => i !== index);
    form.setValue("category_ids", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name="author_ids"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel className="text-primary font-semibold!">
            Category
          </FormLabel>

          {categoryIds.map((categoryId: string, index: number) => {
            const category = categoryData.find(
              (a) => a.id_category === categoryId
            );

            return (
              <div key={index} className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      className={cn(
                        "flex-1 h-12 rounded-2xl justify-between",
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
                        placeholder="Cari author..."
                        onValueChange={setQuery}
                      />
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {filteredCategories.map((a) => (
                          <CommandItem
                            key={a.id_category}
                            value={a.id_category}
                            onSelect={() =>
                              updateCategory(index, a.id_category)
                            }
                            disabled={categoryIds.includes(a.id_category)}
                          >
                            <Avatar
                              name={a.id_category}
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
                            {a.id_category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
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
                    className="w-12 h-12 rounded-2xl"
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
