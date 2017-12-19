import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import * as MentionPlugin from './MentionPlugin'

export type SlateValue = any

interface State {
    menuProps: MentionPlugin.IPickerProps
    value: SlateValue
}

export default class Example extends React.Component<{}, State> {
    menu: HTMLElement
    plugins: any[]

    state = {
        menuProps: MentionPlugin.defaultPickerProps,
        value: Value.fromJSON(MentionPlugin.initialValue)
    }

    constructor(props: {}) {
        super(props)

        this.plugins = [
            MentionPlugin.Plugin({
                onChangeMenuProps: this.onChangePickerProps
            })
        ]
    }

    onChangeValue = (change: any) => {
        // Must always update the value to allow normal use of editor such as cursor movement and typing
        this.setState({
            value: change.value
        })

        // Also compute the new positino of menu if needed
        const menu = this.menu
        if (!menu) {
            return
        }

        const { value } = this.state
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

        const menuProps: Partial<MentionPlugin.IPickerProps> = {
            bottom,
            left,
            searchText: '',
        }

        this.onChangePickerProps(menuProps)
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

    render() {
        console.log(`isMenuVisible: `, this.state.menuProps.isVisible)
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
                        menuRef={this.onMenuRef}
                        {...this.state.menuProps}
                    />
                    <Editor
                        className="mention-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onChangeValue}
                        plugins={this.plugins}
                    />
                </div>
            </div>
        </div>
    }
}