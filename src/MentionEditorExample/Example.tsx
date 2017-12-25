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
    plugins: any[]

    state = {
        menuProps: MentionPlugin.defaultPickerProps,
        value: Value.fromJSON(MentionPlugin.initialValue)
    }

    constructor(props: {}) {
        super(props)

        this.plugins = [
            MentionPlugin.OptionalPlugin(),
            MentionPlugin.MentionPlugin({
                onChangeMenuProps: this.onChangeMenuProps
            }),
        ]
    }

    onChangeValue = (change: any) => {
        this.onChangeMenuProps({
            bottom: 0,
            left: 0,
            searchText: ''
        })

        this.setState({
            value: change.value
        })
    }

    onChangeMenuProps = (menuProps: Partial<MentionPlugin.IPickerProps>) => {
        console.log(`onChangeMenuProps: `)
        this.setState(prevState => ({
            menuProps: { ...prevState.menuProps, ...menuProps }
        }))
    }

    render() {
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