"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Table";
import { Info } from "lucide-react";
import type { IEmbeddedEntity, IMetadata } from "@/lib/db/models";
import Image from "next/image";
export type selectedType = Map<string, IEmbeddedEntity>;
export type setSelectedType = (m: selectedType) => void;

export const getColumns = (
  selected: selectedType,
  setSelected: setSelectedType
): ColumnDef<IEmbeddedEntity>[] => {
  return [
    {
      accessorKey: "profile",
      maxSize: 200,
      header: () => {
        return <span>Profile</span>;
      },
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        const name = row.getValue("name") as string;
        console.log(id);
        const size = 40;
        return <DinoImage id={id} name={name} size={size} />;
      },
    },
    {
      accessorKey: "id",
      maxSize: 200,
      header: () => {
        return <span>id</span>;
      },
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      maxSize: 200,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-row justify-start">
          <span className="capitalize">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "metadata",
      maxSize: 200,
      header: () => {
        return <span>Description</span>;
      },
      cell: ({ row }) => {
        const metadata = row.getValue("metadata") as IMetadata;
        const view = Array<React.ReactNode>();
        Object.keys(metadata).forEach((key) => {
          if (key === "id" || key === "name") {
            return;
          }
          view.push(
            <div key={`metadata-${key}`} className="flex flex-row">
              <span className="font-semibold">{key}:</span>
              <span className="ml-2">{metadata[key]}</span>
            </div>
          );
        });
        return view;
      },
    },
    {
      accessorKey: "Remove",
      maxSize: 200,
      header: () => {
        return <span className="flex flex-row justify-end">Remove</span>;
      },
      cell: ({ row }) => (
        <div className="group flex cursor-pointer flex-row justify-end text-crimson-500 hover:text-crimson-200">
          <button
            type="button"
            className="flex w-[80px] flex-row"
            onClick={() => {
              const id = row.getValue("id");
              if (id) {
                selected.delete(id);
                console.log(selected);
                setSelected(new Map(selected));
              }
            }}
          >
            <Info /> <span className="ml-2">Delete</span>
          </button>
        </div>
      ),
    },
  ];
};

interface SearchDataTableProps {
  visibleColumns?: any;
  selected: Map<string, IEmbeddedEntity>;
  title: string;
  setSelected: setSelectedType;
}

export function SearchDataTable({
  title,
  visibleColumns = {
    id: false,
    name: true,
    metadata: true,
  },
  selected,
  setSelected,
}: SearchDataTableProps) {
  /*
    How do we register changes?
    1. mutate data to show the latest state on the page before save button is clicked
    2. add every mutated data to a new map at the same time as it is going to be persisted when 'save' is clicked
  */
  let data: IEmbeddedEntity[] = [];
  if (selected !== null) {
    data = [...selected].map(([_, v]) => v);
  }
  const columns = getColumns(selected, setSelected);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(visibleColumns);
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 2000,
      },
    },
    autoResetPageIndex: false,
    autoResetExpanded: false,
  });

  return (
    <div className="w-full border px-6">
      <div className="flex h-[68px] w-full items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="rounded-md border-none">
        <Table className="">
          <TableHeader className="sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-px border-b-gray-900"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-end">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
      </div>
    </div>
  );
}

const DinoImage = ({
  id,
  name,
  size,
}: {
  id: string;
  name: string;
  size: number;
}) => {
  const [imgSrc, setImgSrc] = React.useState("/dinos/unknown.png");
  const originSrc = `/dinos/${name}.png`;
  console.log(originSrc);
  React.useEffect(() => {
    fetch(originSrc)
      .then((result) => {
        if (result.status === 200) {
          setImgSrc(originSrc);
        }
      })
      .catch((e) => {
        console.log("error when detching image", e);
      });
  }, []);

  return (
    <div
      key={`div-img-${id}`}
      className={`h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-blue-500`}
    >
      <Image
        key={`img-${id}`}
        alt={`image of ${id}`}
        height={size}
        width={size}
        src={imgSrc}
      />
    </div>
  );
};
