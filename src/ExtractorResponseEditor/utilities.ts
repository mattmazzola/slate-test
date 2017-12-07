import { Value } from 'slate'
import { ISegement, IGenericEntity, SegementType, MatchedOption } from './models'

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