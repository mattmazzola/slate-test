import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from './value'
import './EntityExtraction.css'

const root = window.document.querySelector('main')

function CodeNode(props: any) {
    return <span className="code-block" {...props.attributes}>{props.children}</span>
}

interface MenuProps {
    menuRef: any
    value: any
    onChange: Function
}

class Menu extends React.Component<MenuProps> {
    hasMark(type: any) {
        const { value }: any = this.props
        return value.activeMarks.some((mark: any) => mark.type == type)
    }

    onClickMark(event: any, type: string) {
        const { value, onChange } = this.props
        event.preventDefault()
        const change = value.change().toggleMark(type)
        onChange(change)
    }

    renderMarkButton(type: any, icon: any) {
        const isActive = this.hasMark(type)
        const onMouseDown = (event: any) => this.onClickMark(event, type)

        return (
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
                <span className="material-icons">{icon}</span>
            </span>
        )
    }

    onMouseDownInsertBlock = (event: React.MouseEvent<HTMLElement>) => {
        // Prevent default to stop focus moving in the editor which would close the menu and preven the click from firing.
        event.preventDefault()
    }

    onClickInsertBlock = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onClickInsertBlock`, event)
        const { value, onChange } = this.props
        event.preventDefault()
        const change = value.change()
            .insertBlock('code_block2')
            // .insertBlock({
            //     type: 'paragraph',
            //     isVoid: true,
            //     data: {
            //         foo: 'bar'
            //     }
            // })
            .insertText('custom block text')

        onChange(change)
    }

    render() {
        return (
            ReactDOM.createPortal(
                <div className="menu hover-menu" ref={this.props.menuRef}>
                    <button type="button" onClick={this.onClickInsertBlock} onMouseDown={this.onMouseDownInsertBlock}>
                        Insert Block
            </button>
                </div>,
                root!
            )
        )
    }
}

interface State {
    value: any
}

class HoveringMenu extends React.Component<any, State> {
    menu: HTMLElement

    state = {
        value: Value.fromJSON(initialValue)
    }

    componentDidMount() {
        this.updateMenu()
    }

    componentDidUpdate() {
        this.updateMenu()
    }

    updateMenu = () => {
        const { value } = this.state
        const menu = this.menu
        if (!menu) return

        if (value.isBlurred || value.isEmpty) {
            menu.removeAttribute('style')
            return
        }

        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        menu.style.opacity = '1'
        menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
        menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, change: any) => {
        console.log(`onKeyDown`, event, change)
    }

    onChange = ({ value }: any) => {
        this.setState({ value })
    }

    menuRef = (menu: any) => {
        this.menu = menu
    }

    renderNode = (props: any): React.ReactNode | void => {
        switch (props.node.type) {
            case 'code_block2': return <CodeNode {...props} />
            case 'paragraph': return <span {...props.attributes}>{props.children}</span>
        }
    }

    render() {
        return (
            <div>
                <Menu
                    menuRef={this.menuRef}
                    value={this.state.value}
                    onChange={this.onChange}
                />
                <Editor
                    className="slate-editor"
                    placeholder="Enter some text..."
                    value={this.state.value}
                    onKeyDown={this.onKeyDown}
                    onChange={this.onChange}
                    renderMark={this.renderMark}
                    renderNode={this.renderNode}
                />
            </div>
        )
    }

    renderMark = (props: any): React.ReactNode | void => {
        const { children, mark } = props
        switch (mark.type) {
            case 'bold': return <strong>{children}</strong>
            case 'code': return <code>{children}</code>
            case 'italic': return <em>{children}</em>
            case 'underlined': return <u>{children}</u>
        }
    }
}

export default HoveringMenu