import * as React from 'react'
import { IOption } from './models'
import './CustomEntity.css'

/* Simulate entity component props which have children */
interface EntityComponentProps {
    children?: any
}

interface Props extends EntityComponentProps {
    option: IOption
}

export const CustomEntity = (props: Props) => {
    const { option } = props
    return (
        <span className="blis-entity blis-entity--prebuilt">
            <div className="blis-entity-indicator noselect">
                <div className="blis-entity-indicator__mincontent">
                    <div className="blis-entity-indicator__name">
                        {option.name}
                    </div>
                </div>
                <div className="blis-entity-indicator__bracket">
                </div>
            </div>
            <span className="blis-entity__text">
                {props.children}
            </span>
        </span>
    )
}

export default CustomEntity