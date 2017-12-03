import * as React from 'react'

export default function PreBuiltEntityNode(props: any) {
    return <span className="entity-inline-node entity-inline-node--prebuilt" {...props.attributes}>{props.children}</span>
}