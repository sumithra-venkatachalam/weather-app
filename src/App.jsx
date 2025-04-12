import './App.css';
import Home from './containers/home/Home';
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
   <>
   <HashRouter>
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
   </HashRouter>
   </>
  )
}

export default App
