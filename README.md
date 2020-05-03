Things to add:

- Add the favicon of each link [DONE]
- Add x next to each link to delete the link [DONE]
- Each session has a "delete" option to delete the session [DONE]
- Each session has a "restore" option to restore the links back to tabs [DONE]
- When a link is clicked, it is opened in a new tab and removed from the list. [DONE]
- When a link is clicked, the focus remains on the Taba tab. [DONE]
- Reduce amount of reloads
- Merging sessions
- If taba is active save all tabs and refresh the active page
- Drag and drop from session to session
- Drag and drop from tab to tab within session


Things to fix:

- Pinned tabs are still included in the links array [DONE]
- The Taba tab itself is also included in the links [DONE]
- Pinned tabs prevent collection
- Some HTML is present in other sites after closing the holder
- When refreshing(programmatically) retain scroll value
- Strip input
- Slowness in restore all

Things to improve code reading:

- Use getSelected instead of query({active: true, currentWindow: true})

Things to do for CSS:
- And have the same height as the amount of lines of the input
- Add a font
- Separate the buttons "Restore All", "Delete All", "Rename", etc.
- Adjust input width for .session-name to match the input