import { PredefinedTemplatesT } from "@/types/types"
import { bugReport, partyInvitation, projectProposal } from "./templateJSON"

export const predefinedTemplates:PredefinedTemplatesT[] = [
    {
        id:1,
        name:"Blank Document",
        json:"",
        preview:`/blank-document.svg`
    },
    {
        name:"Project Proposal",
        json:JSON.stringify(projectProposal),
        preview:`/project_proposal.png`
    },
    {
        name:"Bug Report",
        json:JSON.stringify(bugReport),
        preview:`/bug_report.png`
    },
    {
        name:"Party Invitation",
        json:JSON.stringify(partyInvitation),
        preview:`/party_invite.png`
    },
]