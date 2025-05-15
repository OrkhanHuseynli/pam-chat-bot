import Search from "@/components/search";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="text-2xl font-bold mt-20">Search</div>
      <div className="text-lg text-muted-foreground">
        This is a placeholder for the search page.
      </div>
      <div className="max-w-[1600px] min-w-[390px] w-[80%]"><Search/></div>
    </div>
  );
}