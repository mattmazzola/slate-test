import * as React from 'react'
import { IOption, IPosition, MatchedOption } from './models'
import FuseMatch from './FuseMatch'
import './EntityPicker.css'

interface MenuProps {
    highlightIndex: number
    isVisible: boolean
    matchedOptions: MatchedOption<IOption>[]
    maxDisplayedOptions: number
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
    onChangeSearchText: (value: string) => void
    onChange: (change: any) => void
    onClickOption: (o: IOption) => void
    onClickNewEntity: () => void
    position: IPosition
    menuRef: any
    searchText: string
    value: any
}

export default class EntityPicker extends React.Component<MenuProps> {
    render() {
        return (
            <div
                className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
                onKeyDown={this.props.onKeyDown}
                ref={this.props.menuRef}
            >
                {this.props.matchedOptions.length !== 0
                    && <ul className="custom-toolbar__results">
                        {this.props.matchedOptions.map((matchedOption, i) =>
                            <li
                                key={matchedOption.original.id}
                                onClick={() => this.props.onClickOption(matchedOption.original)}
                                className={`custom-toolbar__result ${this.props.highlightIndex === i ? 'custom-toolbar__result--highlight' : ''}`}
                            >
                                <FuseMatch matches={matchedOption.matchedStrings} />
                            </li>
                        )}

                    </ul>}
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={this.props.onClickNewEntity}
                    className="custom-toolbar__new-entity-button"
                >
                    New Entity
                </button>
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
            </div>
        )
    }
}