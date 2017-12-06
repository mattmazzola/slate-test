import * as React from 'react'
import EntityPicker from './EntityPicker'
import * as Fuse from 'fuse.js'
import { IOption, IPosition, FuseResult, MatchedOption } from './models'
import { convertMatchedTextIntoStyledStrings } from './utilities'

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
    isVisible: boolean
    options: IOption[]
    maxDisplayedOptions: number
    menuRef: any
    position: IPosition
    rootElement: Element
    value: any

    onSelectOption: (o: IOption) => void
    onChange: (change: any) => void
}

interface State {
    highlightIndex: number
    searchText: string
    matchedOptions: MatchedOption<IOption>[]
}

const initialState: State = {
    highlightIndex: 0,
    searchText: '',
    matchedOptions: []
}

type IndexFunction = (x: number, limit?: number) => number
// TODO: Id function doesn't need limit but TS requires consistent arguments
const id = (x: number) => x
const increment = (x: number, limit: number) => (x + 1) > limit ? 0 : x + 1
const decrement = (x: number, limit: number) => (x - 1) < 0 ? limit : x - 1

export default class EntityPickerContainer extends React.Component<Props, State> {
    fuse: Fuse
    element: HTMLElement

    state = initialState

    constructor(props: Props) {
        super(props)

        this.onChangeSearchText = this.onChangeSearchText.bind(this)
        this.fuse = new Fuse(this.props.options, fuseOptions)
        this.state.matchedOptions = props.options.filter((_, i) => i < props.maxDisplayedOptions)
            .map<MatchedOption<IOption>>(option => ({
                matchedStrings: [{ text: option.name, matched: false }],
                original: option
            }))
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.isVisible === false
            && nextProps.isVisible === true) {

            this.fuse = new Fuse(this.props.options, fuseOptions)

            const matchedOptions = this.fuse.search<FuseResult<IOption>>(this.state.searchText)
                .filter((_, i) => i < nextProps.maxDisplayedOptions)
                .map(result => convertMatchedTextIntoStyledStrings(result.item.name, result.matches[0].indices, result.item))

            this.setState(prevState => ({
                ...initialState,
                matchedOptions,
                highlightIndex: prevState.highlightIndex > (matchedOptions.length - 1) ? 0 : prevState.highlightIndex
            }))
        }
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        let modifyFunction: IndexFunction = id

        switch (event.key) {
            case 'ArrowUp': {
                modifyFunction = decrement
                break;
            }
            case 'ArrowDown':
                modifyFunction = increment
                break;
            case 'Enter':
            case 'Tab':
                // It's possible to tab into the entity picker without their being a selection
                if (this.props.value.selection.isCollapsed) {
                    console.warn(`preventing action because entity picker is focused without selection`)
                    return
                }
                this.onSelectHighlightedOption()
                event.stopPropagation()
                event.preventDefault()
                break;
        }

        this.setState(prevState => ({
            highlightIndex: modifyFunction(prevState.highlightIndex, prevState.matchedOptions.length - 1)
        }))
    }

    onSelectHighlightedOption = () => {
        const matchedOption = this.state.matchedOptions[this.state.highlightIndex]
        this.props.onSelectOption(matchedOption.original)
        this.setState({
            ...initialState
        })
    }

    onChangeSearchText(searchText: string) {
        console.log(`searchText `, searchText)
        const matchedOptions = this.fuse.search<FuseResult<IOption>>(searchText)
            .filter((_, i) => i < this.props.maxDisplayedOptions)
            .map(result => {
                const indices = result.matches[0].indices.map<[number, number]>(([start, end]) => [start, end+1])
                console.log(`indices: `, indices)
                const matchedOption = convertMatchedTextIntoStyledStrings(result.item.name, indices, result.item)
                console.log(`matchedOption: `, matchedOption)
                return matchedOption
            })

        this.setState(prevState => ({
            searchText,
            matchedOptions,
            highlightIndex: prevState.highlightIndex > (matchedOptions.length - 1) ? 0 : prevState.highlightIndex
        }))
    }

    onClickResult = (option: IOption) => {
        this.props.onSelectOption(option)
        this.setState({
            ...initialState
        })
    }

    onRef = (node: HTMLElement) => {
        this.element = node
    }

    getPosition = (position: IPosition) => {
        const { bottom, left } = position
        return {
            bottom,
            left
        }
    }

    render() {
        return (
            <EntityPicker
                highlightIndex={this.state.highlightIndex}
                isVisible={this.props.isVisible}
                matchedOptions={this.state.matchedOptions}
                maxDisplayedOptions={this.props.maxDisplayedOptions}
                position={this.props.position}
                menuRef={this.props.menuRef}
                searchText={this.state.searchText}
                rootElement={this.props.rootElement}
                value={this.props.value}

                onChangeSearchText={this.onChangeSearchText}
                onClickOption={this.onClickResult}
                onKeyDown={this.onKeyDown}
                onChange={this.props.onChange}
            />
        )
    }
}