import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductBasicDetails({ categories }: { categories: any[] }) {
  const { control } = useFormContext();

  return (
    <div className="bg-surface border border-outline-variant/30 p-8 space-y-6">
      <h2 className="font-heading text-xl font-medium tracking-tight text-primary">Basic Details</h2>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Product Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Classic Watch" className="rounded-none focus-visible:ring-primary" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Description</FormLabel>
            <FormControl>
              <Textarea rows={4} placeholder="Product description..." className="rounded-none resize-none focus-visible:ring-primary" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Base Price ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" className="rounded-none focus-visible:ring-primary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="rounded-none focus-visible:ring-primary bg-transparent">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="uppercase tracking-widest text-on-surface-variant text-xs">Features (Comma separated)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Water resistant, Sapphire crystal" className="rounded-none focus-visible:ring-primary" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
