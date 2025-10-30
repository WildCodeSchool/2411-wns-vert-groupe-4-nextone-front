"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

export interface MultiSelectPopoverProps {
  options?: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  /**
   * Si fourni, sera rendu dans <PopoverTrigger asChild>{trigger}</PopoverTrigger>
   * sinon le Popover reste utilisable en uncontrolled (ex: ouvert par hover/keyboard selon implémentation)
   */
  trigger?: React.ReactNode;
  open?: boolean; // optional controlled mode
  onOpenChange?: (open: boolean) => void;
}

export function MultiSelectPopover({
  options = [],
  selected,
  onChange,
  trigger,
  open,
  onOpenChange,
}: MultiSelectPopoverProps) {
  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(updatedSelected);
    },
    [selected, onChange]
  );

  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {trigger ? <PopoverTrigger asChild>{trigger}</PopoverTrigger> : null}

      <PopoverContent>
        <Command>
          <CommandInput
            placeholder="Search options..."
            value={query}
            onValueChange={(v: string) => setQuery(v)} // cmdk / shadcn: onValueChange
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {filtered.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
