import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IPosition } from '../models'

interface MenuProps {
    rootElement: Element
    isVisible: boolean
    position: IPosition
    menuRef: any
    value: any
    onChange: Function
}

export default class Menu extends React.Component<MenuProps> {
    onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        // Prevent default to stop focus moving in the editor which would close the menu and preven the click from firing.
        event.preventDefault()
    }

    onClickInsertBlock = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onClickInsertBlock`, event)
        const { value, onChange } = this.props
        const selectedText = (value.characters ? value.characters.toJSON() : [])
            .reduce((s: string, node: any) => s += node.text, '')

        event.preventDefault()
        const change = value.change()
            .insertBlock({
                type: 'custom-block-node',
                data: {
                    foo: 'bar'
                },
                nodes: [
                    {
                        kind: 'text',
                        leaves: [
                            {
                                text: selectedText
                            }
                        ]
                    }
                ]
            })
            .collapseToEnd()

        onChange(change)
    }

    onClickInsertInline = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onClickInsertInline`, event)
        const { value, onChange } = this.props
        const selectedText = (value.characters ? value.characters.toJSON() : [])
            .reduce((s: string, node: any) => s += node.text, '')

        event.preventDefault()
        const change = value.change()
            .insertInline({
                type: 'custom-inline-node',
                data: {
                    foo: 'baz'
                },
                nodes: [
                    {
                        kind: 'text',
                        leaves: [
                            {
                                text: selectedText
                            }
                        ]
                    }
                ]
            })
            .collapseToEnd()

        onChange(change)
    }

    onClickWrapInline = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onClickWrapInline`, event)
        const { value, onChange } = this.props

        event.preventDefault()
        const change = value.change()
            .wrapInline({
                type: 'custom-inline-node',
                data: {
                    foo: 'bar'
                }
            })
            .collapseToEnd()

        onChange(change)
    }

    render() {
        return (
            ReactDOM.createPortal(
                <div
                    className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
                    ref={this.props.menuRef}
                >
                    <button type="button" onClick={this.onClickInsertBlock} onMouseDown={this.onMouseDown}>
                        Insert Block
                    </button>
                    <button type="button" onClick={this.onClickInsertInline} onMouseDown={this.onMouseDown}>
                        Insert Inline
                    </button>
                    <button type="button" onClick={this.onClickWrapInline} onMouseDown={this.onMouseDown}>
                        Wrap Inline
                    </button>
                </div>,
                this.props.rootElement
            )
        )
    }
}