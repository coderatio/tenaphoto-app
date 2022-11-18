import Dashboard from "./Pages/Dashboard";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import PageNotFound from "./Pages/PageNotFound";
import Login from "./Pages/Login";
import AuthRoute from "./Components/AuthRoute";

export default function App() {
  return (
      <div className="App">
          <Routes>
              <Route path="/" element={ <Home/> } />
              <Route path="/login" element={ <Login/> } />
              <Route path="/register" element={ <Register/> } />
              <Route element={<AuthRoute/>}>
                <Route path='/dashboard' element={<Dashboard/>}/>
              </Route>
              <Route path="*" element={<PageNotFound />} />
          </Routes>
      </div>
  );
}
