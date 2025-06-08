import Search from "@/components/search";
import { SearchHeader } from "@/components/search-header";

export default function Page() {
  return (
    <>
      <SearchHeader />
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-2xl font-bold mt-20">Search</div>
        <div className="text-lg text-muted-foreground">Search your data</div>
        <div className="max-w-[1600px] min-w-[390px] w-4/5">
          <Search />
        </div>
      </div>
    </>
  );
}
