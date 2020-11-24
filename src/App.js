import React from "react";
import './App.scss';
import Header from "./Components/Header";
import Editor from './Container/Editor';
import Output from './Container/Output';

function App() {
  const isDesktop = window.innerWidth > 768 ? true : false;
    return (
      <div className="App">
        <Header isDesktop={isDesktop} />
        <div className="flex height100">
          {isDesktop &&  <Editor />}
          <Output isDesktop={isDesktop} />
        </div>
      </div>
    );
}

export default App;