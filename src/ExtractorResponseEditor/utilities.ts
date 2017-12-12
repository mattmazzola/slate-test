import { Value } from 'slate'
import { ISegement, IGenericEntity, SegementType, MatchedOption, NodeType } from './models'

/**
 * Recursively walk up DOM tree until root or parent with non-static position is found.
 * (relative, fixed, or absolute) which will be used as reference for absolutely positioned elements within it
 */
export const getRelativeParent = (element: HTMLElement | null): HTMLElement => {
    if (!element) {
        return document.body
    }

    const position = window.getComputedStyle(element).getPropertyValue('position')
    if (position !== 'static') {
        return element
    }

    return getRelativeParent(element.parentElement)
};

export const valueToJSON = (value: any) => {
    const characters = value.characters ? value.characters.toJSON() : [];
    return {
        data: value.data.toJSON(),
        decorations: value.decorations ? value.decorations.toJSON() : [],
        document: value.toJSON().document,
        activeMarks: value.activeMarks.toJSON(),
        marks: value.marks.toJSON(),
        texts: value.texts.toJSON(),
        characters,
        selectedText: characters.reduce((s: string, node: any) => s += node.text, ''),
        selection: value.selection.toJSON()
    }
}

export const convertEntitiesAndTextToEditorValue = (text: string, customEntities: IGenericEntity<any>[], inlineType: string) => {
    const nodes = customEntities.reduce<ISegement[]>((segements, entity) => {
        const segementIndexWhereEntityBelongs = segements.findIndex(seg => seg.startIndex <= entity.startIndex && entity.endIndex <= seg.endIndex)
        const prevSegements = segements.slice(0, segementIndexWhereEntityBelongs)
        const nextSegements = segements.slice(segementIndexWhereEntityBelongs + 1, segements.length)
        const segementWhereEntityBelongs = segements[segementIndexWhereEntityBelongs]

        const prevSegementEndIndex = entity.startIndex - segementWhereEntityBelongs.startIndex
        const prevSegementText = segementWhereEntityBelongs.text.substring(0, prevSegementEndIndex)
        const prevSegement: ISegement = {
            ...segementWhereEntityBelongs,
            text: prevSegementText,
            endIndex: prevSegementEndIndex,
        }

        const nextSegementStartIndex = entity.endIndex - segementWhereEntityBelongs.startIndex
        const nextSegementText = segementWhereEntityBelongs.text.substring(nextSegementStartIndex, segementWhereEntityBelongs.text.length)
        const nextSegement: ISegement = {
            ...segementWhereEntityBelongs,
            text: nextSegementText,
            startIndex: nextSegementStartIndex,
        }

        const newSegement: ISegement = {
            text: segementWhereEntityBelongs.text.substring(prevSegementEndIndex, nextSegementStartIndex),
            startIndex: entity.startIndex,
            endIndex: entity.endIndex,
            type: SegementType.Inline,
            data: entity.data
        }

        return [...prevSegements, prevSegement, newSegement, nextSegement, ...nextSegements]
    }, [
            {
                text,
                startIndex: 0,
                endIndex: text.length,
                type: SegementType.Normal,
                data: {}
            }
        ])
        .map(segement => {
            if (segement.type === 'inline') {
                return {
                    "kind": "inline",
                    "type": inlineType,
                    "isVoid": false,
                    "data": segement.data,
                    "nodes": [
                        {
                            "kind": "text",
                            "leaves": [
                                {
                                    "kind": "leaf",
                                    "text": segement.text,
                                    "marks": []
                                }
                            ]
                        }
                    ]
                }
            }

            return {
                "kind": "text",
                "leaves": [
                    {
                        "kind": "leaf",
                        "text": segement.text,
                        "marks": []
                    }
                ]
            }
        })

    const document = {
        "document": {
            "nodes": [
                {
                    "kind": "block",
                    "type": "paragraph",
                    "isVoid": false,
                    "data": {},
                    "nodes": nodes
                }
            ]
        }
    }

    return Value.fromJSON(document)
}

export const convertMatchedTextIntoStyledStrings = <T>(text: string, matches: [number, number][], original: T): MatchedOption<T> => {
    const matchedStrings = matches.reduce<ISegement[]>((segements, [startIndex, endIndex]) => {
        if (startIndex === endIndex) {
            return segements
        }

        const segementIndexWhereEntityBelongs = segements.findIndex(seg => seg.startIndex <= startIndex && endIndex <= seg.endIndex)
        const prevSegements = segements.slice(0, segementIndexWhereEntityBelongs)
        const nextSegements = segements.slice(segementIndexWhereEntityBelongs + 1, segements.length)
        const segementWhereEntityBelongs = segements[segementIndexWhereEntityBelongs]

        const prevSegementEndIndex = startIndex - segementWhereEntityBelongs.startIndex
        const prevSegementText = segementWhereEntityBelongs.text.substring(0, prevSegementEndIndex)
        const prevSegement: ISegement = {
            ...segementWhereEntityBelongs,
            text: prevSegementText,
            endIndex: prevSegementEndIndex,
        }

        const nextSegementStartIndex = endIndex - segementWhereEntityBelongs.startIndex
        const nextSegementText = segementWhereEntityBelongs.text.substring(nextSegementStartIndex, segementWhereEntityBelongs.text.length)
        const nextSegement: ISegement = {
            ...segementWhereEntityBelongs,
            text: nextSegementText,
            startIndex: nextSegementStartIndex,
        }

        const newSegement: ISegement = {
            text: segementWhereEntityBelongs.text.substring(prevSegementEndIndex, nextSegementStartIndex),
            startIndex: startIndex,
            endIndex: endIndex,
            type: SegementType.Inline,
            data: {
                matched: true
            }
        }

        const newSegements = prevSegements
        if (prevSegement.startIndex !== prevSegement.endIndex) {
            newSegements.push(prevSegement)
        }

        if (newSegement.startIndex !== newSegement.endIndex) {
            newSegements.push(newSegement)
        }

        if (nextSegement.startIndex !== nextSegement.endIndex) {
            newSegements.push(nextSegement)
        }

        return [...newSegements, ...nextSegements]
    }, [
            {
                text,
                startIndex: 0,
                endIndex: text.length,
                type: SegementType.Normal,
                data: {
                    matched: false
                }
            }
        ]).map(({ text, data }) => ({
            text,
            matched: data.matched
        }))

    return {
        original,
        matchedStrings
    }
}

export const getEntitiesFromValue = (change: any) => {
    const inlineNodes = change.value.document.filterDescendants((node: any) => node.type === NodeType.CustomEntityNodeType)

    /**
     * TODO: Find out how to properly convert inline nodes back to entities
     * Currently the issue is that the anchorOffset and focusOffset are relative to the node they are within
     * but the entities we operate on are absolute values relative to the start of the entire text and I know
     * how to convert those back to absolute values.
     * 
     * The current implementation is kind of hack to compare selectedText with all text; however, this has issue with repeated
     * entities on repeated words which must then be deduped.  This is relying on fact that it will hopefully not occur often.
     * However, it should be improved.
     */
    return inlineNodes.map((node: any, i: number) => {
        const selectionChange = change
            .moveToRangeOf(node)
        const text = selectionChange.value.document.text
        const selectedText = (selectionChange.value.characters ? selectionChange.value.characters.toJSON() : []).reduce((s: string, node: any) => s += node.text, '')
        const startIndex = text.search(selectedText)
        const endIndex = startIndex + selectedText.length

        return {
            startIndex,
            endIndex,
            text: selectedText,
            data: node.data.toJS()
        }
    })
        .toJS()
        .reduce((entities: any[], entity: IGenericEntity<any>) => {
            return entities.some(e => e.startIndex === entity.startIndex && e.endIndex === entity.endIndex)
                ? entities
                : [...entities, entity]
        }, [])
}