import { PredefinedTemplatesT } from "@/types/types"
import { bugReport, partyInvitation, projectProposal } from "./templateJSON"

export const predefinedTemplates:PredefinedTemplatesT[] = [
    {
        id:1,
        name:"Blank Document",
        json:"",
        preview:`${process.env.BASE_URL}/blank-document.svg`
    },
    {
        name:"Project Proposal",
        json:JSON.stringify(projectProposal),
        preview:`${process.env.BASE_URL}/project_proposal.png`
    },
    {
        name:"Bug Report",
        json:JSON.stringify(bugReport),
        preview:`${process.env.BASE_URL}/bug_report.png`
    },
    {
        name:"Party Invitation",
        json:JSON.stringify(partyInvitation),
        preview:`${process.env.BASE_URL}/party_invite.png`
    },
]