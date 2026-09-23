import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [number, setNumber] = useState(null);
  const [operator, setOperator] = useState("");

  // Numbers
  const addNumber = (num) => {
    if (display === "0") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  // Operators
  const addOperator = (op) => {
    setNumber(Number(display));
    setOperator(op);
    setDisplay("0");
  };

  // Calculate
  const calculate = () => {
    const secondNumber = Number(display);
    let answer = 0;

    if (operator === "+") {
      answer = number + secondNumber;
    }

    if (operator === "-") {
      answer = number - secondNumber;
    }

    if (operator === "*") {
      answer = number * secondNumber;
    }

    if (operator === "/") {
      if (secondNumber === 0) {
        setDisplay("Error");
        return;
      }

      answer = number / secondNumber;
    }

    setDisplay(String(answer));
    setNumber(null);
    setOperator("");
  };

  // Clear
  const clear = () => {
    setDisplay("0");
    setNumber(null);
    setOperator("");
  };

  // Decimal
  const decimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Plus / Minus
  const sign = () => {
    setDisplay(String(Number(display) * -1));
  };

  // Percentage
  const percent = () => {
    setDisplay(String(Number(display) / 100));
  };

  return (
    <div className="app">
      <div className="calculator">

        {/* Header */}
        <div className="calculator-header">
          <div>
            <p className="small-title">WEB INTERFACE</p>
            <h1>Calculator</h1>
          </div>

          <div className="status-dot"></div>
        </div>

        {/* Display */}
        <div className="display-section">
          <div className="calculation">
            {number !== null && `${number} ${operator}`}
          </div>

          <h2>{display}</h2>
        </div>

        {/* Buttons */}
        <div className="buttons">

          <button className="function" onClick={clear}>
            AC
          </button>

          <button className="function" onClick={sign}>
            ±
          </button>

          <button className="function" onClick={percent}>
            %
          </button>

          <button className="operator" onClick={() => addOperator("/")}>
            ÷
          </button>

          <button onClick={() => addNumber("7")}>7</button>
          <button onClick={() => addNumber("8")}>8</button>
          <button onClick={() => addNumber("9")}>9</button>

          <button
            className="operator"
            onClick={() => addOperator("*")}
          >
            ×
          </button>

          <button onClick={() => addNumber("4")}>4</button>
          <button onClick={() => addNumber("5")}>5</button>
          <button onClick={() => addNumber("6")}>6</button>

          <button
            className="operator"
            onClick={() => addOperator("-")}
          >
            −
          </button>

          <button onClick={() => addNumber("1")}>1</button>
          <button onClick={() => addNumber("2")}>2</button>
          <button onClick={() => addNumber("3")}>3</button>

          <button
            className="operator"
            onClick={() => addOperator("+")}
          >
            +
          </button>

          <button
            className="zero"
            onClick={() => addNumber("0")}
          >
            0
          </button>

          <button onClick={decimal}>
            .
          </button>

          <button
            className="equals"
            onClick={calculate}
          >
            =
          </button>

        </div>

        {/* Footer */}
        <div className="footer-text">
          REACT • CALCULATOR APPLICATION
        </div>

      </div>
    </div>
  );
}

export default App;