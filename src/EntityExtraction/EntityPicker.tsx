import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IOption, IPosition } from './models'
import './EntityPicker.css'

interface MenuProps {
    highlightIndex: number
    isVisible: boolean
    matchedOptions: IOption[]
    maxDisplayedOptions: number
    onChangeSearchText: (value: string) => void
    onClickOption: (o: IOption) => void
    rootElement: Element
    position: IPosition
    menuRef: any
    onChange: Function
    searchText: string
    value: any
}

export default class EntityPicker extends React.Component<MenuProps> {
    onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onMouseDown`)
        // Prevent default to stop focus moving in the editor which would close the menu and preven the click from firing.
        event.preventDefault()
        event.stopPropagation()
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
                    onMouseDown={this.onMouseDown}
                    ref={this.props.menuRef}
                >
                    {this.props.matchedOptions.length !== 0
                        && <ul className="custom-toolbar__results">
                            {this.props.matchedOptions.map((option, i) =>
                                <li
                                    key={option.id}
                                    onClick={() => this.props.onClickOption(option)}
                                    className={`custom-toolbar__result ${this.props.highlightIndex === i ? 'custom-toolbar__result--highlight' : ''}`}
                                >
                                    {option.name}
                                </li>
                            )}
                        </ul>}
                    <div className="custom-toolbar__search">
                        <label htmlFor="toolbar-input">Search for entities:</label>
                        <input
                            id="toolbar-input"
                            type="text"
                            value={this.props.searchText}
                            className="custom-toolbar__input"
                            onChange={event => this.props.onChangeSearchText(event.target.value)}
                        />
                    </div>
                    <div>
                        <button type="button" onClick={this.onClickInsertBlock}>
                            Insert Block
                        </button>
                        <button type="button" onClick={this.onClickInsertInline}>
                            Insert Inline
                        </button>
                        <button type="button" onClick={this.onClickWrapInline}>
                            Wrap Inline
                        </button>
                    </div>
                </div>,
                this.props.rootElement
            )
        )
    }
}