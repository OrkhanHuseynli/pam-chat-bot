'use client';

import { Command, CommandGroup, CommandInput, CommandList, CommandItem } from '@/components/ui/Command';
import { useRef, useState } from 'react';
import { DinosaurEntity } from '@/lib/db/seedData';
import { DinosaurDataTable } from './ui/DataTable/DinosaurDataTable';
import { AddButton } from './ui/AddButton';

const DEBOUNCE_TIME = 350;

export function debounce(func: Function, delay: number) {
  let timeout: any = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}


export type selectedType = Map<string, DinosaurEntity>;
type selectedTypeMap = Map<string, selectedType>;

export default function Search() {
  const [data, setData] = useState<DinosaurEntity[]>([]);
  const inputRef = useRef(null);
  const [selected, setSelected] = useState<selectedType>(new Map<string, DinosaurEntity>());
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<selectedTypeMap>(new Map<string, Map<string, DinosaurEntity>>());

  const onSelectEvent = (dino: DinosaurEntity) => {
    // const current: any = inputRef.current;
    selected.set(dino.id, dino);
    setSelected(new Map(selected));
  };

  function search(text: string) {
    fetch(`/api/search?text=${text}`)
      .then((res) => {
        const json = res.json();
        return json;
      })
      .then((d) => {
        console.log(d);
        if (d.data) {
          setData(d.data);
        } else {
          setData([]);
        }
      });
  }
  const debounceSearch = debounce(search, DEBOUNCE_TIME);

  return (
    <>
      <div className='col-span-2 border-1 border-gray-400 bg-neutral px-3 py-2'>
        <div className='flex items-center'>
          <Command className='border-1 border-gray-400' filter={() => 1}>
            <CommandInput
              ref={inputRef}
              placeholder='Search for colleagues'
              className='h-[56px] text-lg'
              onValueChange={(text) => {
                debounceSearch(text);
              }}
            />
            <CommandGroup>
              <CommandList className=''>
                <CommandListGroup items={data} onSelectEvent={onSelectEvent} selectedItems={selected} />
              </CommandList>
            </CommandGroup>
          </Command>
        </div>
      </div>
      <br />
      <DinosaurDataTable title='Dinosaurs' selected={selected} setSelected={setSelected} />
    </>
  );
}

function CommandListGroup({
  items,
  selectedItems,
  onSelectEvent
}: {
  items: DinosaurEntity[];
  onSelectEvent: (items: DinosaurEntity) => void;
  selectedItems: selectedType;
}) {
  const list = items.map((item: DinosaurEntity) => {
    const alreadySelected = selectedItems.has(item.id);
    return (
      <CommandItem
        key={item.id}
        value={item.name}
        className='w-full justify-between'
      >
        <div className='font-mcKinsey capitalize'>
          <strong>{item.name}</strong> <span className='text-gray-600'>{item.habitat}</span>
        </div>
        <AddButton
          size='lg'
          variant={alreadySelected ? 'outline-success' : 'outline'}
          onClick={() => {
            if (!alreadySelected) {
              onSelectEvent(item);
            }
          }}
        >
          {alreadySelected ? <span className='mx-1'>Added</span> : <span className='mx-[9px]'>Add</span>}
        </AddButton>
      </CommandItem>
    );
  });

  return list;
}
