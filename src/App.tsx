import * as React from 'react'
import * as ExtractorResponseEditor from './ExtractorResponseEditor'
import './App.css'
import { IGenericEntity } from './ExtractorResponseEditor/models'

interface EditorState {
    text: string
    customEntities: ExtractorResponseEditor.Models.IGenericEntity<any>[]
    preBuiltEntities: ExtractorResponseEditor.Models.IGenericEntity<any>[]
}

interface State {
    options: ExtractorResponseEditor.Models.IOption[]
    editors: EditorState[]
}

const fixtureCustomEntityOptions: ExtractorResponseEditor.Models.IOption[] = [
    {
        id: '1',
        name: 'entity1'
    },
    {
        id: '2',
        name: 'entity2'
    },
    {
        id: '3',
        name: 'entity3'
    },
    {
        id: '4',
        name: 'entity4'
    },
    {
        id: '5',
        name: 'entity5'
    },
]

const fixturePreBuiltEntityOptions: ExtractorResponseEditor.Models.IOption[] = [
    {
        id: '1',
        name: 'preBuiltEntity1'
    },
    {
        id: '2',
        name: 'preBuiltEntity2'
    },
    {
        id: '3',
        name: 'preBuiltEntity3'
    },
]

class App extends React.Component<{}, State> {
    customEntityButtonClicks: number = 0

    state: State = {
        options: fixtureCustomEntityOptions,
        editors: [
            {
                text: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
                customEntities: [
                    {
                        startIndex: 0,
                        endIndex: 2,
                        name: fixtureCustomEntityOptions[1].name,
                        data: {
                            option: fixtureCustomEntityOptions[1]
                        }
                    }
                ],
                preBuiltEntities: [
                    {
                        startIndex: 0,
                        endIndex: 5,
                        name: fixturePreBuiltEntityOptions[0].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[0]
                        }
                    },
                    {
                        startIndex: 12,
                        endIndex: 17,
                        name: fixturePreBuiltEntityOptions[1].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[1]
                        }
                    }
                ]
            },
            {
                text: `This is the starting text for the second editor.
This is another paragraph`,
                customEntities: [
                    {
                        startIndex: 6,
                        endIndex: 11,
                        name: fixtureCustomEntityOptions[1].name,
                        data: {
                            option: fixtureCustomEntityOptions[1]
                        }
                    }
                ],
                preBuiltEntities: [
                    {
                        startIndex: 0,
                        endIndex: 5,
                        name: fixturePreBuiltEntityOptions[0].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[0]
                        }
                    },
                    {
                        startIndex: 12,
                        endIndex: 17,
                        name: fixturePreBuiltEntityOptions[1].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[1]
                        }
                    }
                ]
            },
            {
                text: `This is the starting text for the second editor.
This is another paragraph`,
                customEntities: [
                    {
                        startIndex: 6,
                        endIndex: 11,
                        name: fixtureCustomEntityOptions[1].name,
                        data: {
                            option: fixtureCustomEntityOptions[1]
                        }
                    }
                ],
                preBuiltEntities: [
                    {
                        startIndex: 0,
                        endIndex: 5,
                        name: fixturePreBuiltEntityOptions[0].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[0]
                        }
                    },
                    {
                        startIndex: 12,
                        endIndex: 17,
                        name: fixturePreBuiltEntityOptions[1].name,
                        data: {
                            option: fixturePreBuiltEntityOptions[1]
                        }
                    }
                ]
            }
        ]
    }

    onClickChangeText = (editorState: EditorState) => {
        this.setState((prevState: State) => {
            const editorStateIndex = prevState.editors.findIndex(es => es === editorState)

            const newEditorState = {
                ...editorState,
                text: `${editorState.text} addedText${Math.floor(Math.random() * 100)}`
            }

            return {
                editors: [...prevState.editors.slice(0, editorStateIndex), newEditorState, ...prevState.editors.slice(editorStateIndex + 1)]
            }
        })
    }

    onClickAddCustomEntity = (editorState: EditorState) => {
        switch (this.customEntityButtonClicks) {
            case 0: {
                this.setState(prevState => {
                    const editorStateIndex = prevState.editors.findIndex(es => es === editorState)

                    const newCustomEntities = [...editorState.customEntities, {
                        startIndex: 0,
                        endIndex: 5,
                        name: fixtureCustomEntityOptions[0].name,
                        data: {
                            option: fixtureCustomEntityOptions[0]
                        }
                    }]

                    const newEditorState = {
                        ...editorState,
                        customEntities: newCustomEntities
                    }

                    return {
                        editors: [...prevState.editors.slice(0, editorStateIndex), newEditorState, ...prevState.editors.slice(editorStateIndex + 1)]
                    }
                })
                break;
            }
            case 1: {
                this.setState(prevState => {
                    const editorStateIndex = prevState.editors.findIndex(es => es === editorState)

                    const newCustomEntities = [...editorState.customEntities, {
                        startIndex: 12,
                        endIndex: 17,
                        name: fixtureCustomEntityOptions[2].name,
                        data: {
                            option: fixtureCustomEntityOptions[2]
                        }
                    }]

                    const newEditorState = {
                        ...editorState,
                        customEntities: newCustomEntities
                    }

                    return {
                        editors: [...prevState.editors.slice(0, editorStateIndex), newEditorState, ...prevState.editors.slice(editorStateIndex + 1)]
                    }
                })
                break;
            }
        }

        this.customEntityButtonClicks++
    }

    onClickAddPrebuiltEntity = (editorState: EditorState) => {
        this.setState(prevState => {
            const editorStateIndex = prevState.editors.findIndex(es => es === editorState)

            const newPreBuiltEntities = [...editorState.preBuiltEntities, {
                startIndex: 0,
                endIndex: 5,
                name: fixturePreBuiltEntityOptions[2].name,
                data: {
                    option: fixturePreBuiltEntityOptions[2]
                }
            }]

            const newEditorState = {
                ...editorState,
                preBuiltEntities: newPreBuiltEntities
            }

            return {
                editors: [...prevState.editors.slice(0, editorStateIndex), newEditorState, ...prevState.editors.slice(editorStateIndex + 1)]
            }
        })
    }

    onChangeCustomEntities = (editorState: EditorState, customEntities: IGenericEntity<any>[]) => {
        const editorStateIndex = this.state.editors.findIndex(es => es === editorState)
        const updatedEditorState = {
            ...editorState,
            customEntities
        }

        const newEditors = [...this.state.editors.slice(0, editorStateIndex), updatedEditorState, ...this.state.editors.slice(editorStateIndex + 1)]
        console.log(`App.onChangeCustomEntities: `, customEntities)
        this.setState({
            editors: newEditors
        })
    }

    onClickNewEntity = () => {
        console.log(`onClickNewEntity`)
    }

    onClickRemove = (editorState: EditorState) => {
        console.log(`onClickRemove`)
        this.setState(prevState => ({
            editors: prevState.editors.filter(es => es !== editorState)
        }))
    }

    render() {
        return (
            <div className="slate-app">
                <header>
                    <h1>Slate Samples</h1>
                </header>
                <section>
                    <div className="container">
                        <h2>1. Entity Extraction</h2>
                        <h3>Requirements</h3>
                        <ul>
                            <li>
                                <h4>Custom Entities</h4>
                                <ul>
                                    <li>Custom entities appear on top row and may have more than one labeled in a single edior</li>
                                    <li>When text in the custom entity editor is selected, show a menu where they can search and select an entity.  The selected text will become a block with bracket and name.</li>
                                </ul>
                            </li>
                            <li>
                                <h4>Pre-Built Entities</h4>
                                <ul>
                                    <li>Pre-Built entities may overlap and it's expected there are fewer of them so put one editor per row for each pre-built entity and resolution detected</li>
                                    <li>Pre-built editors should be in read only mode since they cannot be modified.</li>
                                </ul>
                            </li>
                        </ul>
                        <h3>Prototype</h3>

                        <div className="prototype">
                            {this.state.editors.map((editorState, i) => (
                                <div
                                    key={i}
                                >
                                    <div>
                                        <button type="button" onClick={() => this.onClickChangeText(editorState)}>Add Text</button>
                                        <button type="button" onClick={() => this.onClickAddCustomEntity(editorState)}>Add Custom Entity</button>
                                        <button type="button" onClick={() => this.onClickAddPrebuiltEntity(editorState)}>Add PreBuilt Entity</button>
                                    </div>
                                    <div className="editor-container">
                                        <ExtractorResponseEditor.Editor
                                            readOnly={i % 2 === 1}
                                            isValid={i % 3 === 0}
                                            options={this.state.options}
                                            text={editorState.text}
                                            customEntities={editorState.customEntities}
                                            preBuiltEntities={editorState.preBuiltEntities}

                                            onChangeCustomEntities={customEntities => this.onChangeCustomEntities(editorState, customEntities)}
                                            onClickNewEntity={this.onClickNewEntity}
                                        />
                                        {(i !== 0) && <div className="editor-container__icons">
                                            <button type="button" onClick={() => this.onClickRemove(editorState)}>Remove</button>
                                        </div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default App
