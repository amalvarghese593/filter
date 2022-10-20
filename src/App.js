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
    { id: "kjkjkj", name: "Mary" },
    { id: "akjakjks", name: "Jane" },
    { id: "aksajsj", name: "Helga" },
  ];

  return (
    <div className="App">
      <Filter filtersWithComponent={filtersWithComponent} persons={persons} />
      <a href="#">learn react</a>
    </div>
  );
}

export default App;
