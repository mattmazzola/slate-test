export const valueToJSON = (value: any) => {
    return {
        document: value.toJSON().document,
        activeMarks: value.activeMarks.toJSON()
    }
}