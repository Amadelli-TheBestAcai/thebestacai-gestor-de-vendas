import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={() => {
            console.log("sending message");
            window.Main.sendMessage("Hello World");
          }}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
