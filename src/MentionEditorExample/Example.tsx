import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import * as MentionPlugin from './MentionPlugin'
import { IOption } from './MentionPlugin/models';

export type SlateValue = any

interface State {
    highlightIndex: number
    options: MentionPlugin.IOption[]
    menuProps: MentionPlugin.IPickerProps
    value: SlateValue
}

const defaultOptions: MentionPlugin.IOption[] = [
    {
        id: '1',
        name: 'Option 1'
    },
    {
        id: '2',
        name: 'Option 2'
    },
    {
        id: '3',
        name: 'Option 3'
    },
    {
        id: '4',
        name: 'Option 4'
    }
]

export default class Example extends React.Component<{}, State> {
    menu: HTMLElement
    plugins: any[]

    state = {
        highlightIndex: 0,
        options: defaultOptions,
        menuProps: MentionPlugin.defaultPickerProps,
        value: Value.fromJSON(MentionPlugin.initialValue)
    }

    constructor(props: {}) {
        super(props)

        this.plugins = [
            MentionPlugin.OptionalPlugin(),
            MentionPlugin.MentionPlugin({
                onChangeMenuProps: this.onChangePickerProps
            })
        ]
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
            console.log(`value.isEmpty`)
            this.onChangePickerProps({
                isVisible: false,
                bottom: 0,
                left: 0,
                searchText: ''
            })
        }

        const relativeParent = MentionPlugin.Utilities.getRelativeParent(this.menu.parentElement)
        const relativeRect = relativeParent.getBoundingClientRect()

        const selection = window.getSelection()
        if (!selection) {
            return
        }

        const range = selection.getRangeAt(0)
        const selectionBoundingRect = range.getBoundingClientRect()

        // const top = ((selectionBoundingRect.top - relativeRect.top) - menu.offsetHeight) + window.scrollY - 20
        const left = (selectionBoundingRect.left - relativeRect.left) + window.scrollX - menu.offsetWidth / 2 + selectionBoundingRect.width / 2
        const bottom = relativeRect.height - (selectionBoundingRect.top - relativeRect.top) + 10
        const searchText = ((value.inlines.size > 0) ? (value.inlines.first().text as string).substr(1) : '')
        const menuProps: Partial<MentionPlugin.IPickerProps> = {
            bottom,
            left,
            searchText,
        }

        this.onChangePickerProps(menuProps)
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, change: any) => {
        const fn = this[`on${event.key}`]
        if (typeof fn === "function") {
            fn.call(this, event, change)
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
            const maxIndex = prevState.options.length - 1

            return {
                highlightIndex: nextIndex < minIndex ? maxIndex : nextIndex
            }
        })
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
            const maxIndex = prevState.options.length - 1

            return {
                highlightIndex: nextIndex > maxIndex ? minIndex : nextIndex
            }
        })
    }

    onEnter(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onEnter`)
    }

    onEscape(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onEscape`)
    }

    onTab(event: React.KeyboardEvent<HTMLInputElement>, change: any) {
        console.log(`onTab`)
    }

    onChangePickerProps = (menuProps: Partial<MentionPlugin.IPickerProps>) => {
        console.log(`onChangePickerProps: `, menuProps)
        this.setState(prevState => ({
            menuProps: { ...prevState.menuProps, ...menuProps }
        }))
    }

    onMenuRef = (element: HTMLElement) => {
        this.menu = element
    }

    onSelectOption = (option: IOption) => {
        console.log(`onSelectOption: `, option)
    }

    render() {
        console.log(`isMenuVisible: `, this.state.menuProps.isVisible)
        const matchedOptions = this.state.options.map((o, i) => ({
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
                Highlight: {this.state.highlightIndex}
                <div className="mention-editor-container">
                    <MentionPlugin.Picker
                        menuRef={this.onMenuRef}
                        {...this.state.menuProps}
                        options={matchedOptions}
                        onSelectOption={this.onSelectOption}
                    />
                    <Editor
                        className="mention-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onChangeValue}
                        onKeyDown={this.onKeyDown}
                        plugins={this.plugins}
                    />
                </div>
            </div>
        </div>
    }
}