import React from "react";
import './App.css';
import Header from "./Components/Header";
import Editor from './Container/Editor';
import Output from './Container/Output';

function App() {
    return (
      <div className="App">
        <Header />
        <div className="flex">
          <Editor />
          <Output />
        </div>
      </div>
    );
}

export default App;