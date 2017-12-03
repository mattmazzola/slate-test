import * as React from 'react'

export default function CustomEntityNode(props: any) {
    return <span className="entity-inline-node entity-inline-node--custom" {...props.attributes}>
        <span>{props.children}</span>
    </span>
}