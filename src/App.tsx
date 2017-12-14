import * as React from 'react'
import * as ExtractorResponseEditor from './ExtractorResponseEditor'
import { replace } from './utilities'
import './App.css'

interface State {
    entities: ExtractorResponseEditor.Models.EntityBase[]
    extractResponses: ExtractorResponseEditor.Models.ExtractResponse[]
}

const fixtureEntities: ExtractorResponseEditor.Models.EntityBase[] = [
    {
        entityId: '1',
        entityName: 'entity1',
        entityType: 'LUIS',
    },
    {
        entityId: '2',
        entityName: 'entity2',
        entityType: 'LUIS',
    },
    {
        entityId: '3',
        entityName: 'entity3',
        entityType: 'LUIS',
    },
    {
        entityId: '4',
        entityName: 'entity4',
        entityType: 'LUIS',
    },
    {
        entityId: '5',
        entityName: 'entity5',
        entityType: 'LUIS',
    },
    {
        entityId: '10',
        entityName: 'luis-datetimeV2',
        entityType: 'datetimeV2',
    },
    {
        entityId: '20',
        entityName: 'luis-number',
        entityType: 'number',
    },
    {
        entityId: '30',
        entityName: 'luis-age',
        entityType: 'age',
    },
]

class App extends React.Component<{}, State> {
    customEntityButtonClicks: number = 0

    state: State = {
        entities: fixtureEntities,
        extractResponses: [
            {
                text: `Word1 Word2 Word3`,
                predictedEntities: [
                    {
                        startCharIndex: 0,
                        endCharIndex: 5,
                        entityName: fixtureEntities[0].entityName,
                        entityId: fixtureEntities[0].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[0].entityType
                    },
                    {
                        startCharIndex: 6,
                        endCharIndex: 11,
                        entityName: fixtureEntities[1].entityName,
                        entityId: fixtureEntities[1].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[1].entityType
                    },
                    {
                        startCharIndex: 12,
                        endCharIndex: 16,
                        entityName: fixtureEntities[5].entityName,
                        entityId: fixtureEntities[5].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[5].entityType
                    }
                ]
            },
            {
                text: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`,
                predictedEntities: [
                    {
                        startCharIndex: 37,
                        endCharIndex: 43,
                        entityName: fixtureEntities[0].entityName,
                        entityId: fixtureEntities[0].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[0].entityType
                    },
                    {
                        startCharIndex: 13,
                        endCharIndex: 24,
                        entityName: fixtureEntities[1].entityName,
                        entityId: fixtureEntities[1].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[1].entityType
                    }
                ]
            },
            {
                text: `This is the starting text for the second editor.
This is another paragraph`,
                predictedEntities: [
                    {
                        startCharIndex: 0,
                        endCharIndex: 4,
                        entityName: fixtureEntities[1].entityName,
                        entityId: fixtureEntities[1].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[1].entityType
                    },
                    {
                        startCharIndex: 12,
                        endCharIndex: 20,
                        entityName: fixtureEntities[2].entityName,
                        entityId: fixtureEntities[2].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[2].entityType
                    },
                    {
                        startCharIndex: 21,
                        endCharIndex: 25,
                        entityName: fixtureEntities[3].entityName,
                        entityId: fixtureEntities[3].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: fixtureEntities[3].entityType
                    }
                ]
            },
            {
                text: `This is the starting text for the THIRD editor.
This is another paragraph`,
                predictedEntities: [
                    {
                        startCharIndex: 0,
                        endCharIndex: 6,
                        entityName: fixtureEntities[1].entityName,
                        entityId: fixtureEntities[1].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: ''
                    },
                    {
                        startCharIndex: 8,
                        endCharIndex: 19,
                        entityName: fixtureEntities[5].entityName,
                        entityId: fixtureEntities[5].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: ''
                    },
                    {
                        startCharIndex: 21,
                        endCharIndex: 24,
                        entityName: fixtureEntities[6].entityName,
                        entityId: fixtureEntities[6].entityId,
                        entityText: '',
                        resolution: {},
                        builtinType: ''
                    }
                ]
            }
        ]
    }

    onClickChangeText = (extractResponse: ExtractorResponseEditor.Models.ExtractResponse) => {
        this.setState((prevState: State) => {
            const extractResponseIndex = prevState.extractResponses.findIndex(es => es === extractResponse)

            const newExtractResponse = {
                ...extractResponse,
                text: `${extractResponse.text} addedText${Math.floor(Math.random() * 100)}`
            }

            return {
                extractResponses: [...prevState.extractResponses.slice(0, extractResponseIndex), newExtractResponse, ...prevState.extractResponses.slice(extractResponseIndex + 1)]
            }
        })
    }

    onClickAddCustomEntity = (extractResponse: ExtractorResponseEditor.Models.ExtractResponse) => {
        console.log(`App.onClickAddCustomEntity`)
        switch (this.customEntityButtonClicks) {
            case 0: {
                this.setState(prevState => {
                    const extractResponseIndex = prevState.extractResponses.findIndex(es => es === extractResponse)

                    const newPredictedEntities: ExtractorResponseEditor.Models.PredictedEntity[] = [
                        ...extractResponse.predictedEntities,
                        {
                            startCharIndex: 30,
                            endCharIndex: 35,
                            entityName: fixtureEntities[4].entityName,
                            entityId: fixtureEntities[4].entityId,
                            entityText: '',
                            resolution: {},
                            builtinType: fixtureEntities[4].entityType
                        }
                    ]

                    const newExtractResponse = {
                        ...extractResponse,
                        predictedEntities: newPredictedEntities
                    }

                    return {
                        extractResponses: [...prevState.extractResponses.slice(0, extractResponseIndex), newExtractResponse, ...prevState.extractResponses.slice(extractResponseIndex + 1)]
                    }
                })
                break;
            }
            case 1: {
                break;
            }
        }

        this.customEntityButtonClicks++
    }

    onClickAddPrebuiltEntity = (extractResponse: ExtractorResponseEditor.Models.ExtractResponse) => {
        console.log(`App.onClickAddPrebuiltEntity`)
        this.setState(prevState => {
            const extractResponseIndex = prevState.extractResponses.findIndex(es => es === extractResponse)

            const newPredictedEntities: ExtractorResponseEditor.Models.PredictedEntity[] = [
                ...extractResponse.predictedEntities,
                {
                    startCharIndex: 10,
                    endCharIndex: 20,
                    entityName: fixtureEntities[7].entityName,
                    entityId: fixtureEntities[7].entityId,
                    entityText: '',
                    resolution: {},
                    builtinType: ''
                }
            ]

            const newExtractResponse = {
                ...extractResponse,
                predictedEntities: newPredictedEntities
            }

            return {
                extractResponses: [...prevState.extractResponses.slice(0, extractResponseIndex), newExtractResponse, ...prevState.extractResponses.slice(extractResponseIndex + 1)]
            }
        })
    }

    onChangeExtractResponse = (extractResponse: ExtractorResponseEditor.Models.ExtractResponse) => {
        console.log(`App.onChangeExtractResponse: `, extractResponse)
        this.setState({
            extractResponses: replace(this.state.extractResponses, extractResponse, x => x.text)
        })
    }

    onClickNewEntity = () => {
        console.log(`onClickNewEntity`)
    }

    onClickRemove = (extractResponse: ExtractorResponseEditor.Models.ExtractResponse) => {
        console.log(`onClickRemove`)
        this.setState(prevState => ({
            extractResponses: prevState.extractResponses.filter(es => es !== extractResponse)
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
                            {this.state.extractResponses.map((extractResponse, i) => (
                                <div
                                    key={i}
                                >
                                    <div>
                                        <button type="button" onClick={() => this.onClickChangeText(extractResponse)}>Add Text</button>
                                        <button type="button" onClick={() => this.onClickAddCustomEntity(extractResponse)}>Add Custom Entity</button>
                                        <button type="button" onClick={() => this.onClickAddPrebuiltEntity(extractResponse)}>Add PreBuilt Entity</button>
                                    </div>
                                    <div className="editor-container">
                                        <ExtractorResponseEditor.EditorWrapper
                                            readOnly={i % 2 === 1}
                                            isValid={i % 3 !== 0}
                                            entities={this.state.entities}
                                            extractorResponse={extractResponse}
                                            onChange={this.onChangeExtractResponse}
                                            onClickNewEntity={this.onClickNewEntity}
                                        />
                                        {(i !== 0) && <div className="editor-container__icons">
                                            <button type="button" onClick={() => this.onClickRemove(extractResponse)}>Remove</button>
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
