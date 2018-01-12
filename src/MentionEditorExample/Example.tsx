import * as React from 'react'
import { Editor } from 'slate-react'
import { Value, Text } from 'slate'
import * as Fuse from 'fuse.js'
import * as MentionPlugin from './MentionPlugin'
import { IOption, NodeTypes } from './MentionPlugin/models'
import { FuseResult, MatchedOption } from '../ExtractorResponseEditor/models'
import { convertMatchedTextIntoStyledStrings } from '../ExtractorResponseEditor/utilities'
import './Example.css'

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

const createEmptySlateValue = () => Value.fromJSON(MentionPlugin.initialValue)

export type SlateValue = any

interface IPayload {
    text: string
    json: any
}

interface State {
    maxDisplayedOptions: number
    highlightIndex: number
    options: MentionPlugin.IOption[]
    matchedOptions: MatchedOption<IOption>[]
    menuProps: MentionPlugin.IPickerProps
    value: SlateValue
    payloads: IPayload[]
}

const defaultOptions: MentionPlugin.IOption[] = [
    {
        id: '1',
        name: 'luis-datetimev2'
    },
    {
        id: '2',
        name: 'luis-ecyclopedia'
    },
    {
        id: '3',
        name: 'MyEntity'
    },
    {
        id: '4',
        name: 'YourEntity'
    }
]

const payload1value = createEmptySlateValue().change().insertText(`Payload 1`).value

export default class Example extends React.Component<{}, State> {
    fuse: Fuse
    menu: HTMLElement
    plugins: any[]

    state = {
        highlightIndex: 0,
        options: defaultOptions,
        matchedOptions: [] as MatchedOption<IOption>[],
        maxDisplayedOptions: 4,
        menuProps: MentionPlugin.defaultPickerProps,
        value: createEmptySlateValue(),
        payloads: [
            {
                text: payload1value.document.text,
                json: payload1value.toJSON()
            }
        ]
    }

    constructor(props: {}) {
        super(props)

        this.fuse = new Fuse(this.state.options, fuseOptions)
        this.state.matchedOptions = this.getDefaultMatchedOptions()

        this.plugins = [
            MentionPlugin.OptionalPlugin(),
            MentionPlugin.MentionPlugin({
                onChangeMenuProps: this.onChangePickerProps
            })
        ]
    }

    getDefaultMatchedOptions() {
        return this.state.options
            .filter((_, i) => i < this.state.maxDisplayedOptions)
            .map<MatchedOption<IOption>>((option, i) => ({
                highlighted: this.state.highlightIndex === i,
                matchedStrings: [{ text: option.name, matched: false }],
                original: option
            }))
    }

    onChangeValue = (change: any) => {
        const { value } = change

        // Must always update the value to allow normal use of editor such as cursor movement and typing
        this.setState({
            value
        })

        // If we've somehow executed before the menu onRef and don't have a reference to the menu element return
        // We need to menu to compute the position so there is no point to continue
        const menu = this.menu
        if (!menu) {
            return
        }

        // TODO: See if there is less expensive way to test this?
        // Might not even be needed since when the text is empty we would have already deleted the inline node
        if (value.document.text.length === 0) {
            this.onChangePickerProps({
                isVisible: false
            })
            return
        }

        // Note: When debugging styling of Picker it is best to comment out this so you can inspect
        // picker elements while selection is not focused
        if (!value.isFocused) {
            this.onChangePickerProps({
                isVisible: false
            })
            return
        }

        const relativeParent = MentionPlugin.Utilities.getRelativeParent(this.menu.parentElement)
        const relativeRect = relativeParent.getBoundingClientRect()

        const selection = window.getSelection()
        if (!selection) {
            this.onChangePickerProps({
                isVisible: false
            })
            return
        }

        // TODO: This logic is duplicated inside the MentionPlugin.  Since it's required to be here, we could collapse the plugin into this module
        // and perhaps that would actually reduce code complexity even though it's less modular
        const isWithinMentionNode = value.inlines.size > 0 && value.inlines.last().type === NodeTypes.Mention
        // If not within an inline node, hide menu
        if (!isWithinMentionNode) {
            this.onChangePickerProps({
                isVisible: false
            })
            return
        }

        const range = selection.getRangeAt(0)
        const selectionBoundingRect = range.getBoundingClientRect()
        // TODO: Hack to get HTML element of current text node since findDOMNode is not working for custom nodes
        // const selectionParentElement = selection.focusNode!.parentElement!
        // const selectionParentBoundingRect = selectionParentElement.getBoundingClientRect()
        // console.log(`selectionParentElement: `, selectionParentElement, selectionParentBoundingRect)

        const top = ((selectionBoundingRect.bottom - relativeRect.top)) + window.scrollY
        const left = (selectionBoundingRect.left - relativeRect.left) + window.scrollX // - menu.offsetWidth / 2 + selectionBoundingRect.width / 2
        const bottom = relativeRect.height - (selectionBoundingRect.top - relativeRect.top)
        const searchText = ((value.inlines.size > 0) ? (value.inlines.first().text as string).substr(1) : '')
        const menuProps: Partial<MentionPlugin.IPickerProps> = {
            isVisible: isWithinMentionNode,
            bottom,
            left,
            top,
            searchText,
        }

        this.onChangePickerProps(menuProps)
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, change: any) => {
        const fn = this[`on${event.key}`]
        if (typeof fn === "function") {
            return fn.call(this, event, change)
        }
    }

    onArrowUp(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onArrowUp`)
        if (!this.state.menuProps.isVisible) {
            return
        }

        event.preventDefault()

        this.setState(prevState => {
            const nextIndex = prevState.highlightIndex - 1
            const minIndex = 0
            const maxIndex = Math.max(0, prevState.matchedOptions.length - 1)

            return {
                highlightIndex: nextIndex < minIndex ? maxIndex : nextIndex
            }
        })

        return true
    }

    onArrowDown(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log('onArrowDown')
        if (!this.state.menuProps.isVisible) {
            return
        }

        event.preventDefault()

        this.setState(prevState => {
            const nextIndex = prevState.highlightIndex + 1
            const minIndex = 0
            const maxIndex = Math.max(0, prevState.matchedOptions.length - 1)

            return {
                highlightIndex: nextIndex > maxIndex ? minIndex : nextIndex
            }
        })

        return true
    }

    onEnter(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onEnter`)
        const option = this.state.matchedOptions[this.state.highlightIndex].original
        return this.onCompleteNode(event, change, option)
    }

    private onCompleteNode(event: React.KeyboardEvent<HTMLInputElement> | undefined, change: any, option: IOption) {
        if (!this.state.menuProps.isVisible || this.state.matchedOptions.length === 0) {
            return
        }

        event && event.preventDefault()

        const textNode = change.value.texts.last()
        if (textNode) {
            change
                .replaceNodeByKey(textNode.key, Text.fromJSON({
                    "kind": "text",
                    "leaves": [
                        {
                            "kind": "leaf",
                            "text": `{${option.name}}`,
                            "marks": [] as any[]
                        }
                    ]
                }))
                .collapseToStartOfNextText()
        }
        else {
            console.warn(`Current selection did not contain any text nodes to insert option name into`, change.value.texts)
        }

        // Mark inline node as completed meaning it is now immutable
        const inline = change.value.inlines.find((i: any) => i.type === NodeTypes.Mention)
        if (inline) {
            change
                .setNodeByKey(inline.key, {
                    data: {
                        ...inline.get('data').toJS(),
                        completed: true
                    }
                })
        }
        else {
            console.warn(`Could not find any inlines matching Mention type`, change.value.inlines)
        }

        change
            .collapseToStartOfNextText()

        // Reset highlight index to be ready for next node
        this.setState({
            highlightIndex: 0
        })

        return true
    }

    onEscape(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onEscape`)
        if (!this.state.menuProps.isVisible) {
            return
        }

        const inline = change.value.inlines.find((i: any) => i.type === NodeTypes.Mention)
        if (!inline) {
            return
        }

        change
            .removeNodeByKey(inline.key)

        return true
    }

    onTab(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onTab`)
        const option = this.state.matchedOptions[this.state.highlightIndex].original
        return this.onCompleteNode(event, change, option)
    }

    onChangePickerProps = (menuProps: Partial<MentionPlugin.IPickerProps>) => {
        // Note: Helpful to debug menu behavior
        // console.log(`onChangePickerProps: `, menuProps)

        const matchedOptions = (typeof menuProps.searchText !== 'string' || menuProps.searchText === "")
            ? this.getDefaultMatchedOptions()
            : this.fuse.search<FuseResult<IOption>>(menuProps.searchText!)
                .filter((_, i) => i < this.state.maxDisplayedOptions)
                .map(result => convertMatchedTextIntoStyledStrings(result.item.name, result.matches[0].indices, result.item))

        this.setState(prevState => ({
            matchedOptions,
            menuProps: { ...prevState.menuProps, ...menuProps }
        }))

        return true
    }

    onMenuRef = (element: HTMLElement) => {
        this.menu = element
    }

    onClickOption = (option: IOption) => {
        console.log(`onClickOption: `, option)
        const change = this.state.value.change()
        this.onCompleteNode(undefined, change, option)

        this.setState(prevState => ({
            value: change.value,
            menuProps: { ...prevState.menuProps, isVisible: false }
        }))
    }

    onClickSave = () => {
        const value = this.state.value
        if (value.length === 0) {
            return
        }

        const newPayload: IPayload = {
            text: value.document.text,
            json: value.toJSON()
        }

        this.setState(prevState => ({
            payloads: [...prevState.payloads, newPayload],
            value: createEmptySlateValue()
        }))
    }

    onClickPayload = (payload: IPayload) => {
        console.log(`onClickPayload: `, payload)
        const value = Value.fromJSON(payload.json)

        this.setState({
            value
        })
    }

    render() {
        const matchedOptions = this.state.matchedOptions.map((o, i) => ({
            ...o,
            highlighted: i === this.state.highlightIndex
        }))

        return <div>
            <h2>1. Mentions</h2>
            <h3>Requirements</h3>
            <ul>
                <li>When user types sequence matching trigger regex, open menu to pick an item based on the text they have typed</li>
                <li>When use removes any character within the added mention, remove entire mention</li>
            </ul>
            <h3>Prototype</h3>
            <div className="prototype">
                <div className="mention-prototype">
                    <div className="mention-prototype__payloads">
                        <h3>Payloads</h3>
                        <ul>
                            {this.state.payloads.map((payload, i) =>
                                <li key={i}><button onClick={() => this.onClickPayload(payload)}>Load {i}</button> {payload.text}</li>
                            )}
                        </ul>
                    </div>
                    <div className="mention-prototype__editor">
                        <div className="mention-editor-container">
                            <MentionPlugin.Picker
                                menuRef={this.onMenuRef}
                                {...this.state.menuProps}
                                matchedOptions={matchedOptions}
                                onClickOption={this.onClickOption}
                            />
                            <Editor
                                className="mention-editor"
                                placeholder="Enter some text..."
                                value={this.state.value}
                                onChange={this.onChangeValue}
                                onKeyDown={this.onKeyDown}
                                plugins={this.plugins}
                            />
                            <button onClick={this.onClickSave}>
                                Save
                            </button>
                        </div>
                        Highlight: {this.state.highlightIndex}
                    </div>
                </div>

            </div>
        </div>
    }
}