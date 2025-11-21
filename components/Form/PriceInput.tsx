import { z } from "zod";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const formatRupiah = (value: string) => {
  const number = value.replace(/[^0-9]/g, "");
  if (!number) return "Rp ";
  const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
};

export const removeRupiahFormat = (value: string) =>
  value.replace(/Rp\s?/g, "").replace(/\./g, "");

export const createRupiahSchema = ({
  min,
  max,
  label = "Nominal",
}: {
  min: number;
  max: number;
  label?: string;
}) =>
  z
    .string()
    .transform((val) => removeRupiahFormat(val))
    .refine((val) => /^\d+$/.test(val), {
      message: `${label} harus berupa angka`,
    })
    .refine((val) => Number(val) >= min, {
      message: `${label} minimal ${min.toLocaleString("id-ID")}`,
    })
    .refine((val) => Number(val) <= max, {
      message: `${label} maksimal ${max.toLocaleString("id-ID")}`,
    });

type RupiahInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
};

export function RupiahInput({
  control,
  name,
  label,
  placeholder = "100.000",
}: RupiahInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    field.onChange(formatRupiah(raw));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              inputMode="numeric"
              placeholder={placeholder}
              className="h-12"
              onChange={(e) => handleChange(e, field)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
