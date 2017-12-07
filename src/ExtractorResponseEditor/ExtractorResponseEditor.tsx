import * as React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import initialValue from './value'
import { IOption, IPosition, ICustomEntity } from './models'
import { valueToJSON, convertEntitiesAndTextToEditorValue, getRelativeParent } from './utilities'
import CustomEntityNode from './CustomEntityNode'
import PreBuiltEntityNode from './PreBuiltEntityNode'
import EntityPicker from './EntityPickerContainer'
import './ExtractorResponseEditor.css'

interface Props {
    options: IOption[]
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

        this.state.value = convertEntitiesAndTextToEditorValue(props.text, props.customEntities, "custom-inline-node")
        this.state.preBuiltEditorValues = props.preBuiltEntities.map<any[]>(preBuiltEntity => convertEntitiesAndTextToEditorValue(props.text, [preBuiltEntity], "prebuilt-inline-node"))
    }

    // TODO: Is this necessary?
    // componentDidMount() {
    //     this.updateMenu()
    // }

    componentDidUpdate() {
        this.updateMenu()
    }

    updateMenu = () => {
        const menu = this.menu
        if (!menu) return

        const { value } = this.state
        // if (value.isBlurred || value.isEmpty) {
        if (value.isEmpty) {
            if (this.state.isMenuVisible !== false) {
                // this.setState({
                //     isMenuVisible: false
                // })
            }
            menu.removeAttribute('style')
            return
        }

        const relativeParent = getRelativeParent(this.menu.parentElement)
        const relativeRect = relativeParent.getBoundingClientRect()

        const selection = window.getSelection()
        if (!selection || selection.isCollapsed) {
            return
        }
        const range = selection.getRangeAt(0)
        const selectionBoundingRect = range.getBoundingClientRect()

        const menuPositionAbsolute: IPosition = {
            top: (selectionBoundingRect.top - menu.offsetHeight) + window.scrollY - 20,
            left: selectionBoundingRect.left + window.scrollX - menu.offsetWidth / 2 + selectionBoundingRect.width / 2,
            bottom: -(selectionBoundingRect.top + window.scrollY - 10)
        }

        const menuPosition: IPosition = {
            top: ((selectionBoundingRect.top - relativeRect.top) - menu.offsetHeight) + window.scrollY - 20,
            left: (selectionBoundingRect.left - relativeRect.left) + window.scrollX - menu.offsetWidth / 2 + selectionBoundingRect.width / 2,
            bottom: relativeRect.height - (selectionBoundingRect.top - relativeRect.top) + 10
        }
        console.log(`menuPositionAbsolute: `, menuPositionAbsolute)
        console.log(`menuPosition: `, menuPosition)

        // this.setState({
        //     isMenuVisible: true,
        //     menuPosition
        // })

        const style: any = {
            visibility: 'visible',
            opacity: '1',
            // top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            bottom: `${menuPosition.bottom}px`,
            transform: 'scale(1)'
        }

        Object.assign(menu.style, style)
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
            case 'custom-inline-node': return <CustomEntityNode {...props} />
            case 'prebuilt-inline-node': return <PreBuiltEntityNode {...props} />
        }
    }

    onSelectOption = (option: IOption) => {
        console.log(`onSelectOption`, option)
        const change = this.state.value.change()
            .wrapInline({
                type: 'custom-inline-node',
                data: {
                    entity: option
                }
            })
            .collapseToEnd()

        this.onChange(change)
    }

    render() {
        return (
            <div className="entity-labeler">
                <div className="entity-labeler__title">Custom Entities:</div>
                <div className="entity-labeler__editor">
                    <Editor
                        className="slate-editor"
                        placeholder="Enter some text..."
                        value={this.state.value}
                        onChange={this.onChange}
                        renderNode={this.renderNode}
                    />
                    <EntityPicker
                        isVisible={this.state.isMenuVisible}
                        options={this.props.options}
                        maxDisplayedOptions={4}
                        menuRef={this.menuRef}
                        position={this.state.menuPosition}
                        value={this.state.value}

                        onSelectOption={this.onSelectOption}
                        onChange={this.onChange}
                    />
                </div>
                {this.state.preBuiltEditorValues.length > 0
                    && <div className="entity-labeler__prebuilt-editors">
                        <div className="entity-labeler__title">Pre-Built Entities:</div>
                        <div className="entity-labeler__editor entity-labeler__editor--prebuilt">
                            {this.state.preBuiltEditorValues.map((preBuiltEditorValue, i) =>
                                <Editor
                                    key={i}
                                    className="slate-editor"
                                    placeholder="Enter pre-built some text..."
                                    value={preBuiltEditorValue}
                                    renderNode={this.renderNode}
                                    readOnly={true}
                                />)}
                        </div>
                    </div>}
            </div>
        )
    }
}

export default HoveringMenu