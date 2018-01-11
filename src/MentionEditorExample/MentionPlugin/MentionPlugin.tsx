import * as React from 'react'
import * as immutable from 'immutable'
import { NodeTypes } from './models'
import MentionNode from './MentionNode'
import './MentionPlugin.css'

export interface IPickerProps {
    isVisible: boolean
    bottom: number
    left: number
    searchText: string
}

export const defaultPickerProps: IPickerProps = {
    isVisible: false,
    bottom: -9999,
    left: -9999,
    searchText: ''
}

export interface IOptions {
    triggerCharacter: string
    onChangeMenuProps: (menuProps: Partial<IPickerProps>) => void
}

const defaultOptions: IOptions = {
    triggerCharacter: '{',
    onChangeMenuProps: () => { },
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

const getNodesByPath = (path: number[], root: any, nodes: any[] = []): any[] => {
    if (path.length === 0) {
        return nodes
    }

    const [nextKey, ...nextPath] = path
    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)

    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return nodes
    }

    nodes.push(nextRoot)

    return getNodesByPath(nextPath, nextRoot, nodes)
}

export default function mentionPlugin(inputOptions: Partial<IOptions> = {}) {
    const options: IOptions = { ...defaultOptions, ...inputOptions }

    return {
        onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any): boolean | void {
            // Check that the key pressed matches our `key` option.
            // console.log(`event.metaKey: `, event.metaKey)
            // console.log(`event.ctrlKey: `, event.ctrlKey)
            // console.log(`event.key: `, event.key)
            const isWithinMentionNode = change.value.inlines.size > 0 && change.value.inlines.last().type === NodeTypes.Mention
            if (!isWithinMentionNode && event.key === options.triggerCharacter) {
                event.preventDefault()
                change
                    .insertInline({
                        type: NodeTypes.Mention,
                        data: {
                            completed: false,
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

                options.onChangeMenuProps({
                    isVisible: true
                })

                return true
            }

            if (isWithinMentionNode && event.key === '}') {
                event.preventDefault()

                // Add closing character
                let nextChange = change
                    .insertText('}')

                // Update current inline optional node with completed: true
                const inline = nextChange.value.inlines.find((i: any) => i.type === NodeTypes.Mention)
                if (inline) {
                    nextChange = nextChange
                        .setNodeByKey(inline.key, {
                            data: {
                                ...inline.get('data').toJS(),
                                completed: true
                            }
                        })
                }
                else {
                    console.warn(`Could not find any inlines matching Mention type`, nextChange.value.inlines)
                }

                nextChange
                    .collapseToStartOfNextText()

                options.onChangeMenuProps({
                    isVisible: false
                })

                return true
            }
        },

        onChange(change: any) {
            const { value, operations } = change

            const removeTextOperations: immutable.List<immutable.Map<any, any>> = operations
                .filter((o: any) => o.type === 'remove_text')

            if (removeTextOperations.size > 0) {
                const selection = change.value.selection
                const { startKey, startOffset } = selection

                // TODO: Generalize between previousSibling method, and node paths method
                const previousSibling = value.document.getPreviousSibling(startKey)
                if (previousSibling && previousSibling.type === NodeTypes.Optional) {
                    if (startOffset === 0) {
                        const removeTextOperation = removeTextOperations.first()
                        const nodes = getNodesByPath(removeTextOperation.toJS().path, value.document)
                        if (nodes.length > 2 && nodes[nodes.length - 2].type === NodeTypes.Optional) {
                            change = change
                                .collapseToEndOfPreviousText()
                        }
                    }
                }

                const paths: number[][] = removeTextOperations.map<number[]>(o => (o! as any).path).toJS()

                const mentionInlineNodesAlongPath: any[] = paths
                    .map(path => findNodeByPath(path, value.document))
                    .filter(n => n)

                // Remove all inline nodes along path that are completed
                mentionInlineNodesAlongPath.reduce((newChange: any, inlineNode: any) => {
                    return inlineNode.data.get('completed')
                        ? newChange
                            .removeNodeByKey(inlineNode.key)
                        : newChange
                }, change)

                // if (mentionInlineNodesAlongPath.length > 0) {
                //     options.onChangeMenuProps({
                //         isVisible: false
                //     })
                // }
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Mention: return <MentionNode {...props} />
            }
        }
    }
}