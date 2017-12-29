export enum NodeTypes {
    Mention = 'mention-inline-node',
    Optional = 'optional-inline-node'
}

export interface IPickerProps {
    isVisible: boolean
    bottom: number
    left: number
    searchText: string
}

export const defaultPickerProps: IPickerProps = {
    isVisible: false,
    bottom: -9999,
    left: -9999,
    searchText: ''
}