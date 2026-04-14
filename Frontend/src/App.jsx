import { Routes, Route } from "react-router-dom"
import Home from "./Home/HomeBox.jsx"
import Login from "./Login/LoginBox.jsx"
import SignIn from "./Signin/SignBox.jsx"

function App() {


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignIn" element={<SignIn />} />

   </Routes>
   )
}

export default App
