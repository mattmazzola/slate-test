import * as React from 'react'
import ExtractorResponseEditor from './ExtractorResponseEditor'
import { convertExtractorResponseToEditorModels, convertGenericEntityToPredictedEntity } from './utilities'
import { IGenericEntity } from './models';

// Slate doesn't have type definitions but we still want type consistency and references so we make custom type
export type SlateValue = any

interface Props {
    readOnly: boolean
    isValid: boolean
    entities: any[]
    extractorResponse: any
    onChange: (extractorResponse: any[]) => void
    onClickNewEntity: () => void
}

class ExtractorResponseEditorContainer extends React.Component<Props, {}> {
    onChangeCustomEntities = (customEntities: IGenericEntity<any>[]) => {
        const newExtractResponse = {
            ...this.props.extractorResponse,
            predictedEntities: customEntities.map(convertGenericEntityToPredictedEntity)
        }

        this.props.onChange(newExtractResponse)
    }

    render() {
        const { readOnly, isValid, onClickNewEntity } = this.props
        const editorParts = convertExtractorResponseToEditorModels(this.props.extractorResponse, this.props.entities)
        return (
            <ExtractorResponseEditor
                readOnly={readOnly}
                isValid={isValid}
                options={editorParts.options}
                text={editorParts.text}
                customEntities={editorParts.customEntities}
                preBuiltEntities={editorParts.preBuiltEntities}

                onChangeCustomEntities={this.onChangeCustomEntities}
                onClickNewEntity={onClickNewEntity}
            />
        )
    }
}

export default ExtractorResponseEditorContainer