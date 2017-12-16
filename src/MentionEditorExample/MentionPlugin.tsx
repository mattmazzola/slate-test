import * as React from 'react'
import { NodeTypes } from './models'
import MentionNode from './MentionNode'
import './MentionPlugin.css'

export interface IOptions {
    triggerCharacter: string
}

const defaultOptions: IOptions = {
    triggerCharacter: '{'
}

export default function mentionPlugin(options: IOptions = defaultOptions) {
    return {
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any): boolean | void {
            // Check that the key pressed matches our `key` option.
            console.log(`event.metaKey: `, event.metaKey)
            console.log(`event.ctrlKey: `, event.ctrlKey)
            console.log(`event.key: `, event.key)

            if (event.key === options.triggerCharacter) {
                event.preventDefault()
                change
                    .insertInline({
                        type: NodeTypes.Mention,
                        data: {
                            foo: 'bar'
                        },
                        nodes: [
                            {
                                kind: 'text',
                                leaves: [
                                    {
                                        text: options.triggerCharacter
                                    }
                                ]
                            }
                        ]
                    })

                return true
            }

            if (event.key === '}') {
                event.preventDefault()

                change
                    .insertText('}')
                    .collapseToStartOfNextText()

                return true
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Mention: return <MentionNode {...props} />
            }
        }
    }
}