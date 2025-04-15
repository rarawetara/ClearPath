import React from "react"; // ← ошибка: лишний пробел и двойные кавычки

const TestComponent = () => {
  const message = "Привет мир"; // ← одинарные кавычки, можно придраться
  return <div> {message} </div>; // ← пробелы внутри JSX
};

export default TestComponent;
