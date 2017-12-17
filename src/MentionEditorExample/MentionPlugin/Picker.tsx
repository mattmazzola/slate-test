import * as React from 'react'
import './Picker.css'

interface Props {
    isVisible: boolean
}

export default class Picker extends React.Component<Props, {}> {
    render() {
        return <div className="mention-picker">
            Picker: {this.props.isVisible ? 'show' : 'hide'}
        </div>
    }
}