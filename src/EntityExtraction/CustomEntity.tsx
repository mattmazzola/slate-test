import * as React from 'react'
import { IOption } from './models'
import './CustomEntity.css'

/* Simulate entity component props which have children */
interface EntityComponentProps {
    children?: any
}

interface Props extends EntityComponentProps {
    option: IOption
    isEditing: boolean
    onClickName: () => void
    onClickDelete: () => void
}

export const CustomEntity = (props: Props) => {
    const { option, isEditing } = props
    console.log(`CustomEntity.data: `, option)
    return (
        <span className={`blis-custom-entity ${isEditing ? 'blis-custom-entity--is-editing' : ''}`}>
            <div className="blis-custom-entity-indicator noselect">
                <div className="blis-custom-entity-indicator__mincontent">
                    <div className="blis-custom-entity-indicator__controls">
                        {isEditing && <button type="button" onClick={props.onClickDelete}>&#10006;</button>}
                    </div>
                    <div className="blis-custom-entity-indicator__name">
                        <button type="button" onClick={props.onClickName}>
                            {option.name}
                        </button>
                    </div>
                </div>
                <div className="blis-custom-entity-indicator__bracket">
                </div>
            </div>
            <span className="blis-custom-entity__text">
                {props.children}
            </span>
        </span>
    )
}

export default CustomEntity