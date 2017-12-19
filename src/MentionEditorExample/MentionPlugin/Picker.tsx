import * as React from 'react'
import './Picker.css'

interface Props {
    isVisible: boolean
    bottom: number,
    left: number,
    searchText: string
    menuRef: (element: HTMLDivElement) => void
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
            Search: {this.props.searchText}
        </div>
    }
}