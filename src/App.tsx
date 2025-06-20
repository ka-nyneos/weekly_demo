import {BrowserRouter, Route, Routes} from "react-router-dom";
import ExposureUpload from "./Client/Pages/FX/ExposureUpload";
import UserCreation from "./Client/Pages/UAM/UserCreation";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserCreation />}></Route>
                <Route path="/exposure-upload" element={<ExposureUpload />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

