import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IOption, IPosition } from './models'
import './EntityPicker.css'

interface MenuProps {
    highlightIndex: number
    isVisible: boolean
    matchedOptions: IOption[]
    maxDisplayedOptions: number
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
    onChangeSearchText: (value: string) => void
    onChange: (change: any) => void
    onClickOption: (o: IOption) => void
    rootElement: Element
    position: IPosition
    menuRef: any
    searchText: string
    value: any
}

export default class EntityPicker extends React.Component<MenuProps> {
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
                    onMouseDown={this.props.onMouseDown}
                    onKeyDown={this.props.onKeyDown}
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