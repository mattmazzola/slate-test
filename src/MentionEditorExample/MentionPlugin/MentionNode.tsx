import * as React from 'react'
import './MentionNode.css'

/* Simulate entity component props which have children */
interface EntityComponentProps {
    node: any
    attributes: any
    children: any
}

interface Props extends EntityComponentProps {
}

export const MentionNode = (props: Props) => {
    return (
        <span className="mention-node" {...props.attributes}>
            {props.children}
        </span>
    )
}

export default MentionNode