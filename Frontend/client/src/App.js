import './App.css';
import {Route,Routes} from "react-router-dom"
import SignUp from "./pages/SignUp.js" 
import Login from "./pages/Login.js" 
import Dashboard from './pages/Dashboard.js';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </>
  );
}

export default App;
