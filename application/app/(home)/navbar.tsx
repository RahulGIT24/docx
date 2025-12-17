'use client';
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";
import { LogOutIcon} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter()
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href={"/"}>
          <Image src={"/logo.svg"} alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Docx</h3>
        <SearchInput />
        <div />
        <div className="right-10 absolute">
          <Button className="bg-blue-600 rounded-full cursor-pointer" onClick={()=>{
            signOut()
            router.replace("/login")
          }}>
            Logout<LogOutIcon size={4} />
          </Button>
        </div>
      </div>
    </nav>
  );
};
