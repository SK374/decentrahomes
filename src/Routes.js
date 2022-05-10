import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import BuyProperty from "./components/BuyProperty";

const RoutesComponent = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<App />} />
        <Route path="/property" exact element={<BuyProperty />} />
      </Routes>
    </BrowserRouter>
  );
  
  export default RoutesComponent;