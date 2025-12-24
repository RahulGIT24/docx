"use client";
import { useAppStore } from "@/store/use-app-store";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";

export const DocumentInput = () => {
  const document = useAppStore((s) => s.document);
  const setDocument = useAppStore((s) => s.setDocument);

  const [prevName, setPrevName] = useState(document?.name || "");
  const [input, setInput] = useState<string>(document?.name || "");
  const [inputEnabled, setInputEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);

  const changeName = async (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (!document) return;
    setInput(document.name);
    setPrevName(document.name);
  }, [document?.name]);

  const updateName = async () => {
    if (!document) return;
    if(!input){
      setInput(prevName);
    }
    try {
      setDocument({
        ...document,
        name: input,
      });
      setUpdating(true);
      await axios.patch(
        "/api/doc/" + document?.id,
        {
          name: input,
        },
        { withCredentials: true }
      );
      setPrevName(input);
    } catch (error) {
      setDocument({
        ...document,
        name: prevName,
      });
      setInput(prevName);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-between">
      {!inputEnabled ? (
        <span
          className="text-lg px-1.5 cursor-pointer truncate w-[10vw]"
          onClick={() => {
            if (updating) return;
            setInputEnabled(true);
          }}
        >
          {input}
        </span>
      ) : (
        <input
          className="text-lg px-1.5 w-[10vw]"
          type="text"
          value={input}
          onChange={(e) => {
            changeName(e);
          }}
          onBlur={() => {
            if (input == "") {
              return;
            }
            setInputEnabled(false);
            updateName();
          }}
          onKeyDown={(e) => {
            if (input == "") {
              return;
            }
            if (e.key == "Enter") {
              setInputEnabled(false);
              updateName();
            }
          }}
        />
      )}
      <BsCloudCheck className="size-4" />
      {/* {updateState === true ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        <BsCloudCheck className="size-4" />
      )} */}
    </div>
  );
};
