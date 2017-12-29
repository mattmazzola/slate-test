import { NodeTypes } from './models'

export const findNodeByPath = (path: number[], root: any, nodeType: string = NodeTypes.Mention): any => {
    if (path.length === 0) {
        return null
    }

    const [nextKey, ...nextPath] = path

    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)
    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return null
    }

    if (nextRoot.type === nodeType) {
        return nextRoot
    }

    return findNodeByPath(nextPath, nextRoot)
}

export const getNodesByPath = (path: number[], root: any, nodes: any[] = []): any[] => {
    if (path.length === 0) {
        return nodes
    }

    const [nextKey, ...nextPath] = path
    const nextRoot = root.findDescendant((node: any, i: number) => i === nextKey)

    // If the node was already removed due to another change it might not exist in the path anymore
    if (nextRoot === null) {
        return nodes
    }

    nodes.push(nextRoot)

    return getNodesByPath(nextPath, nextRoot, nodes)
}