"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function FiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "";
  const currentMaterial = searchParams.get("material") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`/collections?${createQueryString(name, value)}`);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const categories = [
    { label: "All Collections", value: "" },
    { label: "Watches", value: "Watches" },
    { label: "Bags & Leather", value: "Bags" },
    { label: "Heritage", value: "Heritage" },
  ];

  const materials = [
    { label: "All Materials", value: "" },
    { label: "Leather (جلد)", value: "leather" },
    { label: "Gold", value: "gold" },
    { label: "Steel", value: "steel" },
    { label: "Platinum", value: "platinum" },
    { label: "Carbon", value: "carbon" },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
  ];

  return (
    <div className="w-full md:w-auto flex items-center gap-6 border-b border-surface-container pb-4 relative" ref={dropdownRef}>
      <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hidden md:block">
        Filter:
      </span>
      
      <div className="flex gap-6 flex-wrap pb-2 flex-grow">
        {/* Category Dropdown */}
        <div className="relative">
          <Button 
            variant="ghost"
            onClick={() => toggleDropdown("category")}
            className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors hover:bg-transparent px-0"
          >
            {categories.find(c => c.value === currentCategory)?.label || "Collection"} <span className="material-symbols-outlined text-sm">{openDropdown === "category" ? "expand_less" : "expand_more"}</span>
          </Button>
          
          {openDropdown === "category" && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-surface-container shadow-lg z-50 py-2">
              {categories.map((cat) => (
                <Button
                  variant="ghost"
                  key={cat.label}
                  onClick={() => handleFilterChange("category", cat.value)}
                  className={`w-full justify-start rounded-none px-4 py-2 font-body-md hover:bg-surface-container-low transition-colors ${currentCategory === cat.value ? "text-primary font-bold bg-surface-container-low" : "text-secondary"}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Material Dropdown */}
        <div className="relative">
          <Button 
            variant="ghost"
            onClick={() => toggleDropdown("material")}
            className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors hover:bg-transparent px-0"
          >
            {materials.find(m => m.value === currentMaterial)?.label || "Material"} <span className="material-symbols-outlined text-sm">{openDropdown === "material" ? "expand_less" : "expand_more"}</span>
          </Button>
          
          {openDropdown === "material" && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-surface-container shadow-lg z-50 py-2">
              {materials.map((mat) => (
                <Button
                  variant="ghost"
                  key={mat.label}
                  onClick={() => handleFilterChange("material", mat.value)}
                  className={`w-full justify-start rounded-none px-4 py-2 font-body-md hover:bg-surface-container-low transition-colors ${currentMaterial === mat.value ? "text-primary font-bold bg-surface-container-low" : "text-secondary"}`}
                >
                  {mat.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Sort Dropdown */}
      <div className="ml-auto pl-6 border-l border-surface-container relative">
        <Button 
          variant="ghost"
          onClick={() => toggleDropdown("sort")}
          className="font-body-md text-body-md text-primary flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-colors hover:bg-transparent px-0"
        >
          {sortOptions.find(o => o.value === currentSort)?.label || "Sort by"} <span className="material-symbols-outlined text-sm">sort</span>
        </Button>
        
        {openDropdown === "sort" && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-surface-container shadow-lg z-50 py-2">
            {sortOptions.map((opt) => (
              <Button
                variant="ghost"
                key={opt.value}
                onClick={() => handleFilterChange("sort", opt.value)}
                className={`w-full justify-start rounded-none px-4 py-2 font-body-md hover:bg-surface-container-low transition-colors ${currentSort === opt.value ? "text-primary font-bold bg-surface-container-low" : "text-secondary"}`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
