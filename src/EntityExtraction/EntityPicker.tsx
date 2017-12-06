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
    render() {
        return (
            ReactDOM.createPortal(
                <div
                    className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
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
                            placeholder="Search input"
                            value={this.props.searchText}
                            className="custom-toolbar__input"
                            onChange={event => this.props.onChangeSearchText(event.target.value)}
                        />
                    </div>
                </div>,
                this.props.rootElement
            )
        )
    }
}