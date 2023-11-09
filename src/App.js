import './App.css';
import Form from './components/Form';

function App() {
  return (
    <div className="App">
      <nav className="bg-blue-500 h-14">
        <div className="container flex justify-between items-center">
          <h1 className="text-white p-3 ml-10 text-xl font-semibold">MyNotes</h1>
        </div>
      </nav>
      <Form />
    </div>
  );
}

export default App;
