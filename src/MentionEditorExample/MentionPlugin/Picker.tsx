import * as React from 'react'
import './Picker.css'
import { IOption } from './models'

interface Props {
    options: IOption[]
    isVisible: boolean
    bottom: number
    left: number
    menuRef: (element: HTMLDivElement) => void
    onSelectOption: (option: IOption) => void
}

export default class Picker extends React.Component<Props, {}> {
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
            {this.props.options.map(option =>
                <button key={option.id} type="button" className={`mention-picker-button ${option.highlighted ? 'mention-picker-button--active': ''}`} onClick={() => this.props.onSelectOption(option)}>{option.name}</button>
            )}
        </div>
    }
}