export const projectProposal = {
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Project Apollo: Proposal" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Prepared by: " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "Product Team" }
      ]
    },
    {
      "type": "image",
      "attrs": {
        "src": "https://placehold.co/800x400/5F55EE/FFFFFF?text=Project+Growth+Projection+Chart",
        "alt": "Growth Chart",
        "title": "Projected Revenue"
      }
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Executive Summary" }]
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [{ "type": "text", "text": "Project Apollo aims to reduce user churn by 15% through a redesigned onboarding flow and improved dashboard latency." }]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Core Objectives" }]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Simplify the sign-up process." }] }]
        },
        {
          "type": "listItem",
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Update UI to match new brand guidelines." }] }]
        }
      ]
    }
  ]
}

export const bugReport = {
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "[BUG] Auth Token Expiry Failure" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "marks": [{ "type": "bold" }], "text": "Priority: " },
        { "type": "text", "text": "High" }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "Description" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Users are not being logged out automatically when their JWT expires. This causes 401 errors on subsequent requests." }]
    },
    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "Screenshot of Error" }]
    },
    {
      "type": "image",
      "attrs": {
        "src": "https://placehold.co/800x400/ff0000/FFFFFF?text=Error+Screenshot+Reference",
        "alt": "Error Screenshot"
      }
    },
    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "Console Output" }]
    },
    {
      "type": "codeBlock",
      "attrs": { "language": "javascript" },
      "content": [
        {
          "type": "text",
          "text": "Error: Request failed with status code 401\n    at createError (createError.js:16)"
        }
      ]
    }
  ]
}

export const partyInvitation = {
  "type": "doc",
  "content": [
    {
      "type": "image",
      "attrs": {
        "src": "https://placehold.co/800x350/FF851B/FFFFFF?text=Sarah's+Birthday+Bash!",
        "alt": "Party Banner"
      }
    },
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "You're Invited! 🎉" }]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Come join us for a night of music, tacos, and terrible karaoke." }
      ]
    },
    {
      "type": "blockquote",
      "content": [
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "WHEN:" },
            { "type": "text", "text": "\nSaturday, November 12th @ 7:00 PM" }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "marks": [{ "type": "bold" }], "text": "WHERE:" },
            { "type": "text", "text": "\nThe rooftop at 123 Main St." }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Please RSVP to " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "sarah@email.com" }
      ]
    }
  ]
}