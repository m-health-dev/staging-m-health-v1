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
import { getAllArticleAuthorWithoutPagination } from "@/lib/article-author/get-article-author";
import type { ArticleAuthorType } from "@/types/articles.types";

interface Props {
  readAuthorIds?: string[];
}

export function AuthorMultiSelectField({ readAuthorIds }: Props) {
  const form = useFormContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorData, setAuthorData] = useState<ArticleAuthorType[]>([]);

  const authorIds = useWatch({ name: "author", control: form.control }) || [];

  console.log("authorIds", authorIds);

  useEffect(() => {
    if (!authorIds || authorIds.length === 0) {
      form.setValue("author", [""], {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [authorIds, form]);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);

      const { data } = await getAllArticleAuthorWithoutPagination();
      setAuthorData(data);

      if (readAuthorIds?.length) {
        form.setValue("author", readAuthorIds, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }

      setLoading(false);
    };

    fetchAuthors();
  }, [readAuthorIds, form]);

  const filteredAuthors = useMemo(() => {
    if (!query.trim()) return authorData.slice(0, 10);
    return authorData.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [authorData, query]);

  const selectedAuthors = useMemo(() => {
    return authorData.filter((a) => authorIds.includes(a.id));
  }, [authorData, authorIds]);

  const updateAuthor = (index: number, id: string) => {
    const next = [...authorIds];
    next[index] = id;
    form.setValue("author", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpenIndex(null);
  };

  const addAuthor = () => {
    if (authorIds.length >= 3) return;
    form.setValue("author", [...authorIds, ""], {
      shouldDirty: true,
    });
  };

  const removeAuthor = (index: number) => {
    const next = authorIds.filter((_: any, i: number) => i !== index);
    form.setValue("author", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name="author"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel className="text-primary font-semibold!">Author</FormLabel>

          {authorIds.map((authorId: string, index: number) => {
            const author = authorData.find((a) => a.id === authorId);

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
                        author && "text-primary font-semibold"
                      )}
                    >
                      {loading ? (
                        <LoadingComponent />
                      ) : author ? (
                        author.name
                      ) : (
                        "Pilih Author"
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Cari author..."
                        onValueChange={setQuery}
                      />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {filteredAuthors.map((a) => (
                            <CommandItem
                              key={a.id}
                              value={a.name}
                              onSelect={() => updateAuthor(index, a.id)}
                              disabled={authorIds.includes(a.id)}
                            >
                              <Avatar
                                name={a.name}
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
                              {a.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {authorIds.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-12 h-12 rounded-2xl"
                    onClick={() => removeAuthor(index)}
                  >
                    <Trash2 />
                  </Button>
                )}

                {index === authorIds.length - 1 && authorIds.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-12 rounded-2xl bg-white"
                    onClick={addAuthor}
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
