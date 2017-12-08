import * as React from 'react'
import * as ExtractorResponseEditor from './ExtractorResponseEditor'
import './App.css'
import { IGenericEntity } from './ExtractorResponseEditor/models';

interface State {
    options: ExtractorResponseEditor.Models.IOption[]
    text: string
    customEntities: ExtractorResponseEditor.Models.IGenericEntity<any>[]
    preBuiltEntities: ExtractorResponseEditor.Models.IGenericEntity<any>[]
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
        text: 'word1 word2 word3',
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

    onClickChangeText = () => {
        this.setState(prevState => ({
            text: `${prevState.text} addedText`
        }))
    }

    onClickAddCustomEntity = () => {
        switch (this.customEntityButtonClicks) {
            case 0: {
                this.setState(prevState => ({
                    customEntities: [...prevState.customEntities, {
                        startIndex: 0,
                        endIndex: 5,
                        name: fixtureCustomEntityOptions[0].name,
                        data: {
                            option: fixtureCustomEntityOptions[0]
                        }
                    }]
                }))
                break;
            }
            case 1: {
                this.setState(prevState => ({
                    customEntities: [...prevState.customEntities, {
                        startIndex: 12,
                        endIndex: 17,
                        name: fixtureCustomEntityOptions[2].name,
                        data: {
                            option: fixtureCustomEntityOptions[2]
                        }
                    }]
                }))
                break;
            }
        }

        this.customEntityButtonClicks++
    }

    onClickAddPrebuiltEntity = () => {
        this.setState(prevState => ({
            preBuiltEntities: [...prevState.preBuiltEntities,
                {
                    startIndex: 0,
                    endIndex: 5,
                    name: fixturePreBuiltEntityOptions[0].name,
                    data: {
                        option: fixturePreBuiltEntityOptions[0]
                    }
                }
            ]
        }))
    }

    onChangeCustomEntities = (customEntities: IGenericEntity<any>[]) => {
        console.log(`App.onChangeCustomEntities: `, customEntities)
        this.setState({
            customEntities
        })
    }

    onClickNewEntity = () => {
        console.log(`onClickNewEntity`)
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
                        <div>
                            <button type="button" onClick={this.onClickChangeText}>Add Text</button>
                            <button type="button" onClick={this.onClickAddCustomEntity}>Add Custom Entity</button>
                            <button type="button" onClick={this.onClickAddPrebuiltEntity}>Add PreBuilt Entity</button>
                        </div>
                        <div className="prototype">
                            <ExtractorResponseEditor.Editor
                                options={this.state.options}
                                text={this.state.text}
                                customEntities={this.state.customEntities}
                                preBuiltEntities={this.state.preBuiltEntities}

                                onChangeCustomEntities={this.onChangeCustomEntities}
                                onClickNewEntity={this.onClickNewEntity}
                            />

                            <ExtractorResponseEditor.Editor
                                options={this.state.options}
                                text={this.state.text}
                                customEntities={this.state.customEntities}
                                preBuiltEntities={this.state.preBuiltEntities}
                                
                                onChangeCustomEntities={this.onChangeCustomEntities}
                                onClickNewEntity={this.onClickNewEntity}
                            />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default App
