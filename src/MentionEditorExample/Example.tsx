import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import * as immutable from 'immutable'
import * as MentionPlugin from './MentionPlugin'
import { NodeTypes, IPickerProps, defaultPickerProps } from './MentionPlugin/models'
import MentionNode from './MentionPlugin/MentionNode'
import OptionalNode from './MentionPlugin/OptionalNode'
import { findNodeByPath, getNodesByPath } from './MentionPlugin/utilities'
import './Example.css'

export type SlateValue = any

interface State {
    menuProps: IPickerProps
    value: SlateValue
}

export default class Example extends React.Component<{}, State> {
    plugins: any[]

    state = {
        menuProps: defaultPickerProps,
        value: Value.fromJSON(MentionPlugin.initialValue)
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>, change: any): boolean | void {
        // Check that the key pressed matches our `key` option.
        // console.log(`event.metaKey: `, event.metaKey)
        // console.log(`event.ctrlKey: `, event.ctrlKey)
        // console.log(`event.key: `, event.key)
        const isWithinOptionalNode = change.value.inlines.size > 0 && change.value.inlines.last().type === NodeTypes.Optional

        if (!isWithinOptionalNode && event.key === '[') {
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

        const isWithinMentionNode = change.value.inlines.size > 0 && change.value.inlines.last().type === NodeTypes.Mention
        if (!isWithinMentionNode && event.key === '{') {
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
                                    text: '{'
                                }
                            ]
                        }
                    ]
                })

            //     options.onChangeMenuProps({
            //         isVisible: true,
            //         bottom: 0,
            //         left: 0,
            //         searchText: ''
            //     })

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
                nextChange
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

            //     this.onChangeMenuProps({
            //         isVisible: false,
            //         bottom: 0,
            //         left: 0,
            //         searchText: ''
            //     })

            return true
        }
    }

    onChangeValue = (change: any) => {
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

            //     this.onChangeMenuProps({
            //         isVisible: false,
            //         bottom: 0,
            //         left: 0,
            //         searchText: ''
            //     })
        }

        this.onChangeMenuProps({
            bottom: 0,
            left: 0,
            searchText: ''
        })

        this.setState({
            value: change.value
        })
    }

    onChangeMenuProps = (menuProps: Partial<IPickerProps>) => {
        console.log(`onChangeMenuProps: `)
        this.setState(prevState => ({
            menuProps: { ...prevState.menuProps, ...menuProps }
        }))
    }

    renderNode(props: any): React.ReactNode | void {
        switch (props.node.type) {
            case NodeTypes.Mention: return <MentionNode {...props} />
            case NodeTypes.Optional: return <OptionalNode {...props} />
        }
    }

    render() {
        return <div>
            <h2>1. Mentions</h2>
            <h3>Requirements</h3>
            <ul>
                <li>When user types sequence matching trigger regex, open menu to pick an item based on the text they have typed</li>
                <li>When use removes any character within the added mention, remove entire mention</li>
            </ul>
            <h3>Prototype</h3>
            <div className="prototype">
                <div className="mention-editor-container">
                    <MentionPlugin.Picker
                        {...this.state.menuProps}
                    />
                    <Editor
                        className="mention-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onChangeValue}
                        onKeyDown={this.onKeyDown}
                        renderNode={this.renderNode}
                    />
                </div>
            </div>
        </div>
    }
}