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
import { InsuranceType } from "@/types/insurance.types";
import { getAllInsuranceWithoutPagination } from "@/lib/insurance/get-insurance";
import Image from "next/image";

interface Props {
  readInsuranceIds?: string[];
}

export function InsuranceMultiSelectField({ readInsuranceIds }: Props) {
  const form = useFormContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [insuranceData, setInsuranceData] = useState<InsuranceType[]>([]);

  const insuranceIds =
    useWatch({ name: "insurance_id", control: form.control }) || [];

  console.log("insuranceIds", insuranceIds);
  useEffect(() => {
    if (!insuranceIds || insuranceIds.length === 0) {
      form.setValue("insurance_id", [""], {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [insuranceIds, form]);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);

      const { data } = await getAllInsuranceWithoutPagination();
      setInsuranceData(data);

      if (readInsuranceIds?.length) {
        form.setValue("insurance_id", readInsuranceIds, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }

      setLoading(false);
    };

    fetchAuthors();
  }, [readInsuranceIds, form]);

  const filteredAuthors = useMemo(() => {
    if (!query.trim()) return insuranceData.slice(0, 10);
    return insuranceData.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [insuranceData, query]);

  const selectedAuthors = useMemo(() => {
    return insuranceData.filter((a) => insuranceIds.includes(a.id));
  }, [insuranceData, insuranceIds]);
  const updateInsurance = (index: number, id: string) => {
    const next = [...insuranceIds];
    next[index] = id;
    form.setValue("insurance_id", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpenIndex(null);
  };

  const addInsurance = () => {
    if (insuranceIds.length >= 3) return;
    form.setValue("insurance_id", [...insuranceIds, ""], {
      shouldDirty: true,
    });
  };

  const removeInsurance = (index: number) => {
    const next = insuranceIds.filter((_: any, i: number) => i !== index);
    form.setValue("insurance_id", next, {
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
          <FormLabel className="text-primary font-semibold!">
            Insurance
          </FormLabel>

          {insuranceIds.map((insuranceId: string, index: number) => {
            const insurance = insuranceData.find((a) => a.id === insuranceId);

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
                        insurance && "text-primary font-semibold",
                      )}
                    >
                      {loading ? (
                        <LoadingComponent />
                      ) : insurance ? (
                        insurance.name
                      ) : (
                        "Pilih Asuransi"
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Cari asuransi..."
                        onValueChange={setQuery}
                      />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>

                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {filteredAuthors.map((a) => (
                            <CommandItem
                              key={a.id}
                              value={a.name}
                              onSelect={() => updateInsurance(index, a.id)}
                              disabled={insuranceIds.includes(a.id)}
                            >
                              {a.name && a.logo ? (
                                <Image
                                  src={a.logo}
                                  alt={a.name || "Insurance Logo"}
                                  width={100}
                                  height={100}
                                  className="object-cover w-5! h-5!  rounded-full border"
                                />
                              ) : (
                                <Avatar
                                  name={a.name}
                                  className="w-5! h-5! border rounded-full"
                                  colors={[
                                    "#3e77ab",
                                    "#22b26e",
                                    "#f2f26f",
                                    "#fff7bd",
                                    "#95cfb7",
                                  ]}
                                  variant="beam"
                                  size={20}
                                />
                              )}
                              {a.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {insuranceIds.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-12 h-12 rounded-2xl"
                    onClick={() => removeInsurance(index)}
                  >
                    <Trash2 />
                  </Button>
                )}

                {index === insuranceIds.length - 1 &&
                  insuranceIds.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-12 h-12 rounded-2xl bg-white"
                      onClick={addInsurance}
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
