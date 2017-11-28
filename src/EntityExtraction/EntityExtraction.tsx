import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import './EntityExtraction.css'
import MarkHotkey from './EntityExractionPlugin'

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        kind: 'text',
                        leaves: [
                            {
                                text: 'A line of text in a paragraph.'
                            }
                        ]
                    }
                ]
            }
        ]
    }
})

const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '~', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' })
]

class EntityExtractor extends React.Component {
    // Set the initial value when the app is first constructed.
    state = {
        value: initialValue
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }: any) => {
        this.setState({ value })
    }

    render() {
        return (
            <div className="slate-ee">
                <h1>Entity Extractor</h1>
                <Editor
                    className="slate-editor"
                    value={this.state.value}
                    onChange={this.onChange}
                    plugins={plugins}
                />
            </div>
        );
    }
}

export default EntityExtractor
