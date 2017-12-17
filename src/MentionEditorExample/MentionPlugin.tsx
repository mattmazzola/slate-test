import * as React from 'react'
import { NodeTypes } from './models'
import * as immutable from 'immutable'
import MentionNode from './MentionNode'
import './MentionPlugin.css'

export interface IOptions {
    triggerCharacter: string
}

const defaultOptions: IOptions = {
    triggerCharacter: '{'
}


const findNodeByPath = (path: number[], root: any, nodeType: string = NodeTypes.Mention): any => {
    if (path.length === 0) {
        return null
    }

    const [nextKey, ...nextPath] = path

    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)
    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return null
    }

    if (nextRoot.type === nodeType) {
        return nextRoot
    }

    return findNodeByPath(nextPath, nextRoot)
}

export default function mentionPlugin(options: IOptions = defaultOptions) {
    return {
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any): boolean | void {
            // Check that the key pressed matches our `key` option.
            // console.log(`event.metaKey: `, event.metaKey)
            // console.log(`event.ctrlKey: `, event.ctrlKey)
            // console.log(`event.key: `, event.key)

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

        onChange(change: any) {
            const { value, operations } = change
            const operationsJs: string[] = operations.toJS()
            const operationTypes: string[] = operationsJs.map((o: any) => o.type)

            if (operationTypes.includes('remove_text')) {
                const removeTextOperations: immutable.List<immutable.Map<any, any>> = operations
                    .filter((o: any) => o.type === 'remove_text')

                const paths: number[][] = removeTextOperations.map<number[]>(o => (o! as any).path).toJS()

                const mentionInlineNodesAlongPath: any[] = paths
                    .map(path => findNodeByPath(path, value.document))
                    .filter(n => n)

                mentionInlineNodesAlongPath.reduce((newChange: any, inlineNode: any) => {
                    return newChange
                        .removeNodeByKey(inlineNode.key)
                }, change)


                // const inlineNodes = change.value.document.filterDescendants((node: any) => node.type === NodeTypes.Mention)
                // console.log(`all inline mention nodes: `, inlineNodes.toJS())
                // const selectionInlines = change.value.inlines
                // console.log(`selection mention nodes: `, selectionInlines.toJS())
                // selectionInlines.reduce((newChange: any, inlineNode: any) => {
                //     return newChange
                //         .removeNodeByKey(inlineNode.key)
                // }, change)
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Mention: return <MentionNode {...props} />
            }
        }
    }
}