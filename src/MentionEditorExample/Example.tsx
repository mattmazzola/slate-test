import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import mentionPlugin from './MentionPlugin'
import initialValue from './value'

export type SlateValue = any

interface State {
    value: SlateValue
}


const plugins = [
    mentionPlugin()
]

export default class Example extends React.Component<{}, State> {
    state = {
        value: Value.fromJSON(initialValue)
    }

    onChangeValue = (change: any) => {
        this.setState({
            value: change.value
        })
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
                    <Editor
                        className="mention-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onChangeValue}
                        plugins={plugins}
                    />
                </div>
            </div>
        </div>
    }
}