"use client";

import { cn } from "@/lib/utils"
import { LucideIcon, Undo2Icon } from "lucide-react"

interface ToolBarButtonProps {
    onClick?: () => void,
    isActive?: boolean,
    icon: LucideIcon
}

const ToolBarButton = (
    {
        onClick,
        isActive,
        icon: Icon
    }: ToolBarButtonProps
) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80"
            )}
        >
            <Icon className="size-4" />
        </button>
    )
}

const ToolBar = () => {

    const sections: {
        label: string,
        icon: LucideIcon,
        onClick: () => void,
        isActive?: boolean
    }[][] = [
            [
                {
                    label: "Undo",
                    icon: Undo2Icon,
                    onClick: () => { console.log("Undo Clicked") }
                }
            ]
        ]

    return <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center">
        {
            sections[0].map((item,_)=>(
                <ToolBarButton key={item.label} {...item}/>
            ))
        }
    </div>
}

export default ToolBar