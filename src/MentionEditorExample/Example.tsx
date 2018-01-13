import * as React from 'react'
import { Value } from 'slate'
import * as Fuse from 'fuse.js'
import * as MentionPlugin from './MentionPlugin'
import './Example.css'

const createEmptySlateValue = () => Value.fromJSON(MentionPlugin.initialValue)

interface IPayload {
    text: string
    json: any
}

interface State {
    disabled: boolean
    options: MentionPlugin.IOption[]
    value: MentionPlugin.SlateValue
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
        disabled: false,
        options: defaultOptions,
        value: createEmptySlateValue(),
        payloads: [
            {
                text: payload1value.document.text,
                json: payload1value.toJSON()
            }
        ]
    }

    onChangeValue = (value: MentionPlugin.SlateValue) => {
        const entities = MentionPlugin.Utilities.getEntitiesFromValue(value)
        // console.log(`onChangeValue.entities: `, entities)
        this.setState({
            value
        })
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

    onClickToggleDisabled = () => {
        this.setState(prevState => ({
            disabled: !prevState.disabled
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
                        <MentionPlugin.PayloadEditor
                            options={this.state.options}
                            placeholder="Enter some text..."
                            value={this.state.value}
                            onChange={this.onChangeValue}
                            disabled={this.state.disabled}
                        />
                        <button onClick={this.onClickSave}>
                            Save
                        </button>
                        <button onClick={this.onClickToggleDisabled}>
                            Toggle Disabled
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}