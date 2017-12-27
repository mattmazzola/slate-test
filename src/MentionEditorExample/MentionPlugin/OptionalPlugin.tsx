import * as React from 'react'
import { NodeTypes } from './models'
import OptionalNode from './OptionalNode'

export interface IOptions {
    triggerCharacter: string
}

const defaultOptions: IOptions = {
    triggerCharacter: '[',
}

export default function optionalPlugin(inputOptions: Partial<IOptions> = {}) {
    let options: IOptions = { ...defaultOptions, ...inputOptions }

    return {
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any): boolean | void {
            const isWithinOptionalNode = change.value.inlines.size > 0 && change.value.inlines.last().type === NodeTypes.Optional
            
            if (!isWithinOptionalNode && event.key === options.triggerCharacter) {
                console.log('insert optional node')
                event.preventDefault()
                change
                    .insertInline({
                        type: NodeTypes.Optional,
                        data: {},
                        nodes: [
                            {
                                kind: 'text',
                                leaves: [
                                    {
                                        text: '['
                                    }
                                ]
                            }
                        ]
                    })

                return true
            }

            if (isWithinOptionalNode && event.key === ']') {
                console.log(`optional.node.collapseToStartOfNextText`)
                event.preventDefault()

                change
                    .insertText(']')
                    .collapseToStartOfNextText()

                return true
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Optional: return <OptionalNode {...props} />
            }
        }
    }
}