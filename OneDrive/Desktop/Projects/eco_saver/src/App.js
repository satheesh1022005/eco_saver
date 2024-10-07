
import './App.css';
import Name from './components/name';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Details from './components/details';
import ChatWindow from './components/ChatWindow';
import Home from './components/Home';
import Learning from './components/learning';
import Eproduct from './components/eproducts';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Name />} />
      <Route path="/home" element={<Home />} />
      <Route path="/details" element={<Details />} />
      <Route path="/bot" element={<ChatWindow/>} />
      <Route path="/learning" element={<Learning/>} />
      <Route path="/eproducts" element={<Eproduct/>} />
    </Routes>
  </Router>
  );
}

export default App;
