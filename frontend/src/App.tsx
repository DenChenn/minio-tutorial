import "./App.css";
import MyDropzone from "./dropzone.tsx";
import FileList from "./list.tsx";

function App() {
  return (
    <div className="app-container">
      <MyDropzone />
      <FileList />
    </div>
  );
}

export default App;
