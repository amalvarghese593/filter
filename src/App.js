import "./App.css";
import { Filter } from "./components/Filter";

function App() {
  const filtersWithComponent = {
    active: {
      name: "active",
      type: "boolean",
      getValue: (val) => (val ? "active" : "inactive"),
    },
  };
  const persons = [
    { id: "123", name: "Mary" },
    { id: "456", name: "Jane" },
    { id: "789", name: "Helga" },
  ];
  return (
    <div className="App">
      <Filter filtersWithComponent={filtersWithComponent} persons={persons} />
      <a href="#">learn react</a>
    </div>
  );
}

export default App;
