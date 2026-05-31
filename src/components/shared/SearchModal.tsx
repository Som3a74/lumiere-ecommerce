"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  product_images: { image_url: string }[];
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [defaultProducts, setDefaultProducts] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && defaultProducts.length === 0) {
      const fetchDefaultProducts = async () => {
        const { data } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            price, 
            product_images(image_url)
          `)
          .limit(4);
        if (data) {
          setDefaultProducts(data);
        }
      };
      fetchDefaultProducts();
    }
  }, [open, supabase, defaultProducts.length]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      const timer = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          price, 
          product_images(image_url)
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, supabase]);

  const handleSelectProduct = (id: string) => {
    setOpen(false);
    setSearchQuery("");
    setResults([]);
    router.push(`/product/${id}`);
  };

  const handleSelectPage = (path: string) => {
    setOpen(false);
    setSearchQuery("");
    setResults([]);
    router.push(path);
  };

  return (
    <>
      <button
        aria-label="Search"
        className="text-primary hover:text-secondary transition-colors duration-300 flex items-center justify-center gap-2"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>
          search
        </span>
        {/* <span className="hidden md:inline-flex text-xs text-secondary border border-surface-container rounded-sm px-1.5 py-0.5 bg-surface-bright font-body-sm tracking-widest uppercase">
          ⌘K
        </span> */}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search products, collections, or pages..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="max-h-[500px]">
          {isSearching && <CommandEmpty>Searching...</CommandEmpty>}
          {!isSearching && results.length === 0 && searchQuery && (
            <CommandEmpty>No results found for &quot;{searchQuery}&quot;.</CommandEmpty>
          )}



          {!searchQuery && defaultProducts.length > 0 && (
            <CommandGroup heading="Suggested Products">
              {defaultProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-4 py-3 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-surface-dim overflow-hidden flex-shrink-0 rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.product_images?.[0]?.image_url || "/placeholder-image.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <span className="font-headline-sm text-primary text-base">{product.name}</span>
                    <span className="font-body-sm text-secondary">${product.price.toLocaleString()}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery && results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-4 py-3 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-surface-dim overflow-hidden flex-shrink-0 rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.product_images?.[0]?.image_url || "/placeholder-image.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <span className="font-headline-sm text-primary text-base">{product.name}</span>
                    <span className="font-body-sm text-secondary">${product.price.toLocaleString()}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
