import * as React from 'react'
import './CustomEntity.css'

/* Simulate entity component props which have children */
interface EntityComponentProps {
    children?: any
}

interface Props extends EntityComponentProps {
    name: string
    isEditing: boolean
    onClickName: () => void
    onClickDelete: () => void
}

export const CustomEntity = (props: Props) => {
    const { name, isEditing } = props
    
    return (
        <span className={`blis-entity blis-entity--custom ${isEditing ? 'blis-entity--is-editing' : ''}`}>
            <div className="blis-entity-indicator noselect">
                <div className="blis-entity-indicator__mincontent">
                    <div className="blis-entity-indicator__controls">
                        {isEditing && <button type="button" onClick={props.onClickDelete}>&#10006;</button>}
                    </div>
                    <div className="blis-entity-indicator__name noselect" spellCheck={false}>
                        <button type="button" onClick={props.onClickName} tabIndex={-1}>
                            {name}
                        </button>
                    </div>
                </div>
                <div className="blis-entity-indicator__bracket">
                </div>
            </div>
            <span className="blis-entity__text" onClick={props.onClickName}>
                {props.children}
            </span>
        </span>
    )
}

export default CustomEntity