import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from './value'
import './EntityExtraction.css'
import { IPosition, ICustomEntity } from '../models'
import { valueToJSON, convertEntitiesAndTextToEditorValue } from './utilities'
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
    preBuiltEditorValues: any[]
}

const disallowedOperations = ['insert_text', 'remove_text']

class HoveringMenu extends React.Component<Props, State> {
    menu: HTMLElement

    state = {
        isMenuVisible: false,
        menuPosition: {
            top: 0,
            left: 0,
            bottom: 0
        },
        value: Value.fromJSON(initialValue),
        preBuiltEditorValues: [{}]
    }

    constructor(props: Props) {
        super(props)

        this.state.value = convertEntitiesAndTextToEditorValue(props.text, props.customEntities)
        this.state.preBuiltEditorValues = props.preBuiltEntities.map<any[]>(preBuiltEntity => convertEntitiesAndTextToEditorValue(props.text, [preBuiltEntity]))
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
        console.group('onChange')
        const { value, operations } = change
        const operationsJs = operations.toJS()
        console.log(`operations: `, operationsJs.map((o: any) => o.type).join(', '))

        const containsDisallowedOperations = operationsJs.some((o: any) => disallowedOperations.includes(o.type))
        if (containsDisallowedOperations) {
            console.log(`containsDisallowedOperations `, containsDisallowedOperations)
            console.groupEnd()
            return
        }

        const valueJson = valueToJSON(value)
        console.log(`value `, valueJson)
        console.groupEnd()

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
            <div className="entity-labeler">
                <h3>CustomEntities</h3>
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
                        className="slate-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onKeyDown={this.onKeyDown}
                        onChange={this.onChange}
                        renderNode={this.renderNode}
                    />
                </div>
                {this.state.preBuiltEditorValues.length > 0
                    && <div>
                        <h3>Pre-Built Entities</h3>
                        {this.state.preBuiltEditorValues.map(preBuiltEditorValue =>
                            (

                                <div>
                                    <Editor
                                        className="slate-editor"
                                        placeholder="Enter pre-built some text..."
                                        value={preBuiltEditorValue}
                                        renderNode={this.renderNode}
                                        readOnly={true}
                                    />
                                </div>
                            ))}
                    </div>}
            </div>
        )
    }
}

export default HoveringMenu