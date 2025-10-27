"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Trash, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  emptyText = "No options found.",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(updatedSelected);
    },
    [selected, onChange]
  );

  //   const selectedLabels = React.useMemo(
  //     () =>
  //       selected
  //         .map((value) => options.find((option) => option.value === value)?.label)
  //         .filter(Boolean)
  //         .join(", "),
  //     [selected, options]
  //   );

  const selectedLabelsWithBadges = React.useMemo(() => {
    return (
      <div className="flex flex-wrap gap-1">
        {selected.map((value) => {
          const option = options.find((option) => option.value === value);
          if (!option) return null;
          return (
            <Badge
              key={value}
              className="flex items-center gap-1 rounded-full px-2 py-1"
            >
              {option.label}
              <Trash
                className="h-1 w-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(value);
                }}
              />
            </Badge>
          );
        })}
      </div>
    );
  }, [selected, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">
            {selected.length > 0 ? selectedLabelsWithBadges : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
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
