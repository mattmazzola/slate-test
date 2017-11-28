import * as React from 'react'

export default function MarkHotkey(options: any) {
    const { type, key } = options

    // Return our "plugin" object, containing the `onKeyDown` handler.
    return {
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
            // Check that the key pressed matches our `key` option.
            console.log(`event.metaKey: `, event.metaKey)
            console.log(`event.ctrlKey: `, event.ctrlKey)
            console.log(`event.key: `, event.key)

            if (!event.ctrlKey || event.key != key) return

            // Prevent the default characters from being inserted.
            event.preventDefault()

            // Toggle the mark `type`.
            change.toggleMark(type)
            console.log(`change.toggleMark(${type})`)

            return true
        },

        renderMark(props: any): any {
            console.log(`props.mark.type: `, props.mark.type)
            switch (props.mark.type) {
                case 'bold': return <strong>{props.children}</strong>
                // Add our new mark renderers...
                case 'code': return <code>{props.children}</code>
                case 'italic': return <em>{props.children}</em>
                case 'strikethrough': return <del>{props.children}</del>
                case 'underline': return <u>{props.children}</u>
            }
        }
    }
}