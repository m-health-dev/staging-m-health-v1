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
import { ArticleAuthorType } from "@/types/articles.types";

interface Props {
  readAuthorIds?: string[];
}

export function AuthorMultiSelectField({ readAuthorIds }: Props) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorData, setAuthorData] = useState<ArticleAuthorType[]>([]);

  const authorIds =
    useWatch({ name: "author_ids", control: form.control }) || [];

  // fetch author + handle update mode
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      const res = await getAllArticleAuthorWithoutPagination();
      setAuthorData(res.data);

      if (readAuthorIds?.length) {
        form.setValue("author_ids", readAuthorIds, {
          shouldDirty: false,
          shouldValidate: true,
        });
      } else if (authorIds.length === 0) {
        // create mode → buka 1 slot
        form.setValue("author_ids", [""]);
      }

      setLoading(false);
    };

    fetchAuthors();
  }, [readAuthorIds]);

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
    form.setValue("author_ids", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };

  const addAuthor = () => {
    if (authorIds.length >= 3) return;
    form.setValue("author_ids", [...authorIds, ""], {
      shouldDirty: true,
    });
  };

  const removeAuthor = (index: number) => {
    const next = authorIds.filter((_: any, i: number) => i !== index);
    form.setValue("author_ids", next, {
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
          <FormLabel className="text-primary font-semibold!">Author</FormLabel>

          {authorIds.map((authorId: string, index: number) => {
            const author = authorData.find((a) => a.id === authorId);

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
                    className="w-12 h-12 rounded-2xl"
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
