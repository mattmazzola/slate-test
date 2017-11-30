import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from './value'
import './EntityExtraction.css'
import { IPosition } from '../models'
import { valueToJSON } from '../utilities';

const menuRootElement = window.document.querySelector('main')

function CodeNode(props: any) {
    return <span className="code-block" {...props.attributes}>{props.children}</span>
}

interface MenuProps {
    rootElement: Element
    isVisible: boolean
    position: IPosition
    menuRef: any
    value: any
    onChange: Function
}

class Menu extends React.Component<MenuProps> {
    onMouseDownInsertBlock = (event: React.MouseEvent<HTMLElement>) => {
        // Prevent default to stop focus moving in the editor which would close the menu and preven the click from firing.
        event.preventDefault()
    }

    onClickInsertBlock = (event: React.MouseEvent<HTMLElement>) => {
        console.log(`onClickInsertBlock`, event)
        const { value, onChange } = this.props
        event.preventDefault()
        const change = value.change()
            // .insertBlock('code_block2')
            // .insertBlock({
            //     type: 'paragraph',
            //     isVoid: true,
            //     data: {
            //         foo: 'bar'
            //     }
            // })
            // .insertText('custom block text')
            .insertInline({
                type: 'code_block2',
                data: {
                    foo: 'bar'
                },
                nodes: [
                    {
                        kind: 'text',
                        leaves: [
                            {
                                text: "testing"
                            }
                        ]
                    }
                ]
            })

        onChange(change)
    }

    render() {
        return (
            ReactDOM.createPortal(
                <div className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`} ref={this.props.menuRef}>
                    <button type="button" onClick={this.onClickInsertBlock} onMouseDown={this.onMouseDownInsertBlock}>
                        Insert Block
                    </button>
                    <button type="button" onClick={this.onClickInsertBlock} onMouseDown={this.onMouseDownInsertBlock}>
                        Insert Block
                    </button>
                </div>,
                this.props.rootElement
            )
        )
    }
}

interface State {
    isMenuVisible: boolean
    menuPosition: IPosition
    value: any
}

class HoveringMenu extends React.Component<any, State> {
    menu: HTMLElement

    state = {
        isMenuVisible: false,
        menuPosition: {
            top: 0,
            left: 0,
            bottom: 0
        },
        value: Value.fromJSON(initialValue)
    }

    // componentDidMount() {
    //     this.updateMenu()
    // }

    componentDidUpdate() {
        this.updateMenu()
    }

    updateMenu = () => {
        console.log('updatemenu')
        const menu = this.menu
        if (!menu) return

        const { value } = this.state
        if (value.isBlurred || value.isEmpty) {
            if (this.state.isMenuVisible !== false) {
                // this.setState({
                //     isMenuVisible: false
                // })
            }
            menu.removeAttribute('style')
            return
        }

        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const selectionBoundingRect = range.getBoundingClientRect()

        const menuPosition: IPosition = {
            top: selectionBoundingRect.top + window.scrollY - menu.offsetHeight,
            left: selectionBoundingRect.left + window.scrollX - menu.offsetWidth / 2 + selectionBoundingRect.width / 2,
            bottom: 0 // TODO: use real value
        }

        // this.setState({
        //     isMenuVisible: true,
        //     menuPosition
        // })

        const style: any = {
            opacity: '1',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
        }

        Object.assign(menu.style, style)
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, change: any) => {
        console.log(`onKeyDown`, event, change)
    }

    onChange = (change: any) => {
        const { value } = change
        const valueJson = valueToJSON(value)
        console.log(`onChange.value `, valueJson)
        this.setState({ value })
    }

    menuRef = (menu: any) => {
        this.menu = menu
    }

    renderNode = (props: any): React.ReactNode | void => {
        switch (props.node.type) {
            case 'code_block2': return <CodeNode {...props} />
            case 'custom_inline': return <CodeNode {...props} />
        }
    }

    render() {
        return (
            <div>
                <Menu
                    rootElement={menuRootElement!}
                    isVisible={this.state.isMenuVisible}
                    position={this.state.menuPosition}
                    menuRef={this.menuRef}
                    value={this.state.value}
                    onChange={this.onChange}
                />
                <Editor
                    autoFocus={true}
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