import * as React from 'react'
import * as ExtractorResponseEditor from './ExtractorResponseEditor'
import './App.css'

interface State {
    options: ExtractorResponseEditor.Models.IOption[]
    text: string
    customEntities: ExtractorResponseEditor.Models.ICustomEntity[]
    preBuiltEntities: ExtractorResponseEditor.Models.ICustomEntity[]
}

const fixtureCustomEntities: ExtractorResponseEditor.Models.IOption[] = [
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
]

const fixturePreBuiltEntities: ExtractorResponseEditor.Models.IOption[] = [
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
    state: State = {
        options: fixtureCustomEntities,
        text: 'word1 word2 word3',
        customEntities: [
            {
                startIndex: 6,
                endIndex: 11,
                data: {
                    entity: fixtureCustomEntities[1]
                }
            }
        ],
        preBuiltEntities: [
            {
                startIndex: 0,
                endIndex: 5,
                data: {
                    entity: fixturePreBuiltEntities[0]
                }
            },
            {
                startIndex: 12,
                endIndex: 17,
                data: {
                    entity: fixturePreBuiltEntities[1]
                }
            }
        ]
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
                            <ExtractorResponseEditor.Editor
                                options={this.state.options}
                                text={this.state.text}
                                customEntities={this.state.customEntities}
                                preBuiltEntities={this.state.preBuiltEntities}
                            />

                            <ExtractorResponseEditor.Editor
                                options={this.state.options}
                                text={this.state.text}
                                customEntities={this.state.customEntities}
                                preBuiltEntities={this.state.preBuiltEntities}
                            />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default App
