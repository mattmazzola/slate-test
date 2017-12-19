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
    onChangeMenuProps: (menuProps: Partial<IPickerProps>) => void
}

const defaultOptions: IOptions = {
    triggerCharacter: '{',
    onChangeMenuProps: () => {},
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

export default function mentionPlugin(inputOptions: Partial<IOptions> = {}) {
    let options: IOptions = { ...defaultOptions, ...inputOptions }

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


                options.onChangeMenuProps({
                    isVisible: true
                })

                return true
            }

            if (event.key === '}') {
                event.preventDefault()

                change
                    .insertText('}')
                    .collapseToStartOfNextText()

                    options.onChangeMenuProps({
                        isVisible: false
                    })

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

                if (mentionInlineNodesAlongPath.length > 0) {
                    options.onChangeMenuProps({
                        isVisible: false
                    })
                }
                mentionInlineNodesAlongPath.reduce((newChange: any, inlineNode: any) => newChange.removeNodeByKey(inlineNode.key), change)
            }
        },

        renderNode(props: any): React.ReactNode | void {
            switch (props.node.type) {
                case NodeTypes.Mention: return <MentionNode {...props} />
            }
        }
    }
}