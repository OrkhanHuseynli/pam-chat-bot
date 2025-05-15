"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/Command";
import { useRef, useState } from "react";
import { IEmbeddedEntity } from "@/lib/db/seedData";
import { SearchDataTable } from "./ui/DataTable/SearchDataTable";
import { AddButton } from "./ui/AddButton";

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

export type selectedType = Map<string, IEmbeddedEntity>;
type selectedTypeMap = Map<string, selectedType>;

export default function Search() {
  const [data, setData] = useState<IEmbeddedEntity[]>([]);
  const inputRef = useRef(null);
  const [selected, setSelected] = useState<selectedType>(
    new Map<string, IEmbeddedEntity>()
  );

  const onSelectEvent = (entity: IEmbeddedEntity) => {
    // const current: any = inputRef.current;
    selected.set(entity.id, entity);
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
      <div className="col-span-2 border-1 border-gray-400 bg-neutral px-3 py-2">
        <div className="flex items-center">
          <Command className="border-1 border-gray-400" filter={() => 1}>
            <CommandInput
              ref={inputRef}
              placeholder="Search for colleagues"
              className="h-[56px] text-lg"
              onValueChange={(text) => {
                debounceSearch(text);
              }}
            />
            <CommandGroup>
              <CommandList className="">
                <CommandListGroup
                  items={data}
                  onSelectEvent={onSelectEvent}
                  selectedItems={selected}
                />
              </CommandList>
            </CommandGroup>
          </Command>
        </div>
      </div>
      <br />
      <SearchDataTable
        title="Dinosaurs"
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
}

function CommandListGroup({
  items,
  selectedItems,
  onSelectEvent,
}: {
  items: IEmbeddedEntity[];
  onSelectEvent: (items: IEmbeddedEntity) => void;
  selectedItems: selectedType;
}) {
  const list = items.map((item: IEmbeddedEntity) => {
    const alreadySelected = selectedItems.has(item.id);
    return (
      <CommandItem
        key={item.id}
        value={item.name}
        className="w-full justify-between"
      >
        <div className="font-mcKinsey capitalize">
          <strong>{item.name}</strong>{" "}
          <span className="text-gray-600">{item.shortDescription}</span>
        </div>
        <AddButton
          size="lg"
          variant={alreadySelected ? "outline-success" : "outline"}
          onClick={() => {
            if (!alreadySelected) {
              onSelectEvent(item);
            }
          }}
        >
          {alreadySelected ? (
            <span className="mx-1">Added</span>
          ) : (
            <span className="mx-[9px]">Add</span>
          )}
        </AddButton>
      </CommandItem>
    );
  });

  return list;
}
