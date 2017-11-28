import * as React from 'react'
import { EntityExtraction } from './EntityExtraction'
import './App.css'

class App extends React.Component {
  render() {
    return (
      <div className="slate-app">
        <header>
          <h1>Slate Samples</h1>
        </header>
        <section>
          <h2>Entity Extraction</h2>
          <h3>Requirements</h3>
          <ul>
            <li></li>
          </ul>
          <hr/>
          <EntityExtraction />
        </section>
      </div>
    );
  }
}

export default App
