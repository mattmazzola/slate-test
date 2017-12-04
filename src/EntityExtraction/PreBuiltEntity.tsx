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
        <span className="blis-custom-entity blis-entity--prebuilt">
            <div className="blis-custom-entity-indicator noselect">
                <div className="blis-custom-entity-indicator__mincontent">
                    <div className="blis-custom-entity-indicator__name">
                        {option.name}
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