import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from './value'
import './EntityExtraction.css'
import { IPosition, ICustomEntity } from '../models'
import { valueToJSON } from '../utilities'
import EntityPickerMenu from './EntityPickerMenu'

const menuRootElement = window.document.querySelector('main')

function CustomBlockNode(props: any) {
    return <span className="custom-block-node" {...props.attributes}>{props.children}</span>
}

function CustomInlineNode(props: any) {
    return <span className="custom-inline-node" {...props.attributes}>{props.children}</span>
}

interface Props {
    text: string
    customEntities: ICustomEntity[]
    preBuiltEntities: ICustomEntity[]
}

interface State {
    isMenuVisible: boolean
    menuPosition: IPosition
    value: any
}

class HoveringMenu extends React.Component<Props, State> {
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

    constructor(props: Props) {
        super(props)

        const nodes = props.customEntities.reduce((segements, entity) => {
            return segements
        }, [
            {
                text: props.text,
                startIndex: 0,
                endIndex: props.text.length - 1,
                type: 'normal'
            }
        ])
            .map(segement => {
                if (segement.type === 'inline') {
                    return {
                        "kind": "inline",
                        "type": "custom-inline-node",
                        "isVoid": false,
                        "data": {},
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "kind": "leaf",
                                        "text": segement.text,
                                        "marks": []
                                    }
                                ]
                            }
                        ]
                    }
                }

                return {
                    "kind": "text",
                    "leaves": [
                        {
                            "kind": "leaf",
                            "text": segement.text,
                            "marks": []
                        }
                    ]
                }
            })

        const document = {
            "document": {
                "nodes": [
                    {
                        "kind": "block",
                        "type": "paragraph",
                        "isVoid": false,
                        "data": {},
                        "nodes": nodes
                    }
                ]
            }
        }

        const value = Value.fromJSON(document)

        this.state.value = value
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
            case 'custom-block-node': return <CustomBlockNode {...props} />
            case 'custom-inline-node': return <CustomInlineNode {...props} />
        }
    }

    render() {
        return (
            <div>
                <EntityPickerMenu
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