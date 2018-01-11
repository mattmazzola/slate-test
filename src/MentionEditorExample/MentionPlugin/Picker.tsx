import * as React from 'react'
import * as Fuse from 'fuse.js'
import './Picker.css'
import { IOption } from './models'
import { FuseResult, MatchedOption } from '../../ExtractorResponseEditor/models'
import FuseMatch from '../../ExtractorResponseEditor/FuseMatch'
import { convertMatchedTextIntoStyledStrings } from '../../ExtractorResponseEditor/utilities'

const fuseOptions: Fuse.FuseOptions = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "name"
    ]
}

interface Props {
    options: IOption[]
    maxDisplayedOptions: number
    isVisible: boolean
    bottom: number
    left: number
    searchText: string
    menuRef: (element: HTMLDivElement) => void
    onSelectOption: (option: IOption) => void
}

interface State {
    matchedOptions: MatchedOption<IOption>[]
}

const initialState: State = {
    matchedOptions: []
}

export default class Picker extends React.Component<Props, State> {
    fuse: Fuse

    state = initialState

    constructor(props: Props) {
        super(props)
        this.fuse = new Fuse(this.props.options, fuseOptions)

        this.state.matchedOptions = props.options.filter((_, i) => i < props.maxDisplayedOptions)
            .map<MatchedOption<IOption>>(option => ({
                matchedStrings: [{ text: option.name, matched: false }],
                original: option
            }))
    }

    componentWillReceiveProps(nextProps: Props) {
        const matchedOptions = this.fuse.search<FuseResult<IOption>>(nextProps.searchText)
            .filter((_, i) => i < nextProps.maxDisplayedOptions)
            .map(result => convertMatchedTextIntoStyledStrings(result.item.name, result.matches[0].indices, result.item))

        this.setState({
            matchedOptions
        })
    }

    render() {
        const style: any = {
            left: `${this.props.left}px`,
            bottom: `${this.props.bottom}px`,
        }

        return <div
            className={`mention-picker ${this.props.isVisible ? 'mention-picker--visible' : ''}`}
            ref={this.props.menuRef}
            style={style}
        >
            {this.state.matchedOptions.map((matchedOption, i) =>
                <button
                    key={matchedOption.original.id}
                    type="button"
                    className={`mention-picker-button ${matchedOption.original.highlighted ? 'mention-picker-button--active' : ''}`}
                    onClick={() => this.props.onSelectOption(matchedOption.original)}>
                    <FuseMatch matches={matchedOption.matchedStrings} />
                </button>
            )}
        </div>
    }
}