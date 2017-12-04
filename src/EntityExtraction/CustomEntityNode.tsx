import * as React from 'react'
import CustomEntity from './CustomEntity'
import { IOption } from './models'

/* Simulate entity component props which have children */
interface EntityComponentProps {
    editor: any
    node: any
    attributes: any
    children: any
}

interface Props extends EntityComponentProps {
    onClickDelete: (option: IOption) => void
}

interface State {
    isEditing: boolean
}

export class CustomEntityContainer extends React.Component<Props, State> {
    state: State = {
        isEditing: false
    }

    onClickName = () => {
        console.log(`CustomEntityContainer.onClickEdit`)
        this.setState(prevState => ({
            isEditing: !prevState.isEditing
        }))
    }

    onClickDelete = () => {
        console.log(`CustomEntityContainer.onClickDelete`)
        this.setState({
            isEditing: false
        })

        const nodeData = this.props.node.data.toJS()
        const option = nodeData.entity
        console.log(`delete: `, option)

        this.props.editor.change((change: any) => {
            change.unwrapInlineByKey(this.props.node.key, this.props.node.type)
        })
    }

    onClickComplete = () => {
        console.log(`onClickComplete`)
        this.setState({
            isEditing: false
        })
    }

    render() {
        const nodeData = this.props.node.data.toJS()
        const option = nodeData.entity

        return (
            <CustomEntity
                isEditing={this.state.isEditing}
                option={option}
                onClickName={this.onClickName}
                onClickDelete={this.onClickDelete}
                {...this.props.attributes}
            >
                {...this.props.children}
            </CustomEntity>
        )
    }
}

export default CustomEntityContainer