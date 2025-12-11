"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/use-search-param";
import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const [search,setSearch] = useSearchParam('search')
  const [value, setValue] = useState(search);

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    inputRef.current?.blur()
    setSearch(value);
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <form className="relative max-w-[720px] w-full" onSubmit={handleSubmit}>
        <Input
          value={value}
          onChange={handleChange}
          ref={inputRef}
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] bg-[#F0F4F8] rounded-full h-12 focus:ring-0"
        />
        <Button
          type="submit"
          variant={"ghost"}
          size={"icon"}
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full"
        >
          <SearchIcon />
        </Button>
        {value && (
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={()=>{
              setValue("")
              inputRef.current?.blur()
              setSearch('')
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};
