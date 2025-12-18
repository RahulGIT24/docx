"use client";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";

export const DocumentInput = ({
  name,
  doc_id,
}: {
  name: string;
  doc_id: number;
}) => {
  const [prevName, setPrevName] = useState(name);
  const [input, setInput] = useState<string>(name);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);

  const changeName = async (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const updateName = async () => {
    try {
      setUpdating(true);
      await axios.patch(
        "/api/doc/" + doc_id,
        {
          name: input,
        },
        { withCredentials: true }
      );
      setPrevName(input);
    } catch (error) {
      console.log(error);
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
            if(updating) return;
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
      <BsCloudCheck />
    </div>
  );
};
