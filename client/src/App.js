import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        {/* <Route path="signup" element={<SignUp />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
