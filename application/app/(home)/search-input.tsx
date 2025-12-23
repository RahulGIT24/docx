"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/use-search-param";
import { useAppStore } from "@/store/use-app-store";
import axios from "axios";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function debounce(fn: any, timeout = 1000) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useSearchParam("search");
  const [value, setValue] = useState(search);
  const setDocs = useAppStore((s) => s.setAllDocuments);
  const setLoading = useAppStore((s)=>s.setDocLoader);

  const searchUserDocs = async (term: string) => {
    
    if (!term) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/doc/search?to_search=${term}`, {
        withCredentials: true,
      });
      setDocs(res.data.data);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const searchDebounceRef = useRef<((term: string) => void) | null>(null);

  useEffect(() => {
    searchDebounceRef.current = debounce((term: string) => {
      searchUserDocs(term);
    }, 500);
  }, []);

  useEffect(() => {
    if (search) {
      searchUserDocs(search);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setValue(newValue);

    if (newValue === "") {
      setSearch("");
    }

    if (searchDebounceRef.current) {
      searchDebounceRef.current(newValue);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form
        className="relative max-w-[720px] w-full"
        onSubmit={(e) => e.preventDefault()}
      >
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
            onClick={() => {
              setValue("");
              inputRef.current?.blur();
              setSearch("");
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
