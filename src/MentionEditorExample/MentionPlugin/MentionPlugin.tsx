import * as React from 'react'
import { NodeTypes } from './models'
import * as immutable from 'immutable'
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
    onChangeMenuProps: (menuProps: IPickerProps) => void
}

const defaultOptions: IOptions = {
    triggerCharacter: '{',
    onChangeMenuProps: (menuProps: IPickerProps) => { },
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
                    isVisible: true,
                    bottom: 0,
                    left: 0,
                    searchText: ''
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
                    const newInline = inline.set('data', inline.data.set('completed', true))
                    
                    nextChange
                        .replaceNodeByKey(inline.key, newInline)
                }
                else {
                    console.warn(`Could not find any inlines matching Mention type`, nextChange.value.inlines)
                }

                nextChange
                    .collapseToStartOfNextText()
                    .collapseToStartOfNextText()

                options.onChangeMenuProps({
                    isVisible: false,
                    bottom: 0,
                    left: 0,
                    searchText: ''
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

                mentionInlineNodesAlongPath.reduce((newChange: any, inlineNode: any) => {
                    return inlineNode.data.get('completed')
                        ? newChange
                            .removeNodeByKey(inlineNode.key)
                        : newChange
                }, change)

                // const inlineNodes = change.value.document.filterDescendants((node: any) => node.type === NodeTypes.Mention)
                // console.log(`all inline mention nodes: `, inlineNodes.toJS())
                // const selectionInlines = change.value.inlines
                // console.log(`selection mention nodes: `, selectionInlines.toJS())
                // selectionInlines.reduce((newChange: any, inlineNode: any) => {
                //     return newChange
                //         .removeNodeByKey(inlineNode.key)
                // }, change)

                options.onChangeMenuProps({
                    isVisible: false,
                    bottom: 0,
                    left: 0,
                    searchText: ''
                })
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Mention: return <MentionNode {...props} />
            }
        }
    }
}