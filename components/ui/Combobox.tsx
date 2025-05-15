'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { CommandList } from 'cmdk';

const itemsData: ComboboxItem[] = [
  {
    value: 'next.js',
    label: 'Next.js'
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit'
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js'
  },
  {
    value: 'remix',
    label: 'Remix'
  },
  {
    value: 'astro',
    label: 'Astro'
  }
];

export interface ComboboxItem {
  value: string;
  label: string;
}
interface ComboboxProps {
  items?: ComboboxItem[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder: string;
}

interface ComboboxContainerProps {
  title: string;
  children: React.ReactElement;
  style?: React.CSSProperties | undefined;
  className?: string | undefined;
}
export function ComboboxContainer({ title, children, style, className }: ComboboxContainerProps) {
  return (
    <div className={className || 'my-2 flex h-[75px] w-full flex-col pr-3 sm:h-full'} style={style}>
      <div className='mb-1 h-6 px-1 text-base text-gray-800'>{title}</div>
      <div className=''>{children}</div>
    </div>
  );
}

export function Combobox({
  placeholder = 'Select an option',
  disabled = false,
  items = itemsData,
  onChange = (v) => {
    console.log(`ComboBox select : ${v}`);
  }
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between border-gray-400'
        >
          {value ? (
            <span className='truncate font-light text-black'>
              {items.find((framework) => framework.value === value)?.label}
            </span>
          ) : (
            <span className='truncate font-light text-gray-500'>{placeholder}</span>
          )}

          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[270px] p-0'>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    onChange(currentValue === value ? '' : currentValue);
                  }}
                >
                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
