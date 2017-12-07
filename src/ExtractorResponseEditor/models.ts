
export interface IPosition {
    top: number
    left: number
    bottom: number
}

export interface IOption {
    id: string
    name: string
}

export interface ICustomEntity {
    startIndex: number
    endIndex: number
    data: any
}

export enum SegementType {
    Normal = "normal",
    Inline = "inline"
}

export interface ISegement {
    text: string
    startIndex: number
    endIndex: number
    type: SegementType
    data: any
}

export interface FuseResult<T> {
    item: T
    matches: FuseMatch[]
}

export interface FuseMatch {
    indices: [number, number][]
    key: string
}

export interface MatchedOption<T> {
    matchedStrings: MatchedString[]
    original: T
}

export interface MatchedString {
    text: string
    matched: boolean
}