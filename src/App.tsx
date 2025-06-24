import {BrowserRouter, Route, Routes} from "react-router-dom";
import ExposureUpload from "./Client/Pages/FX/ExposureUpload";
import ExposureBucketing from "./Client/Pages/FX/ExposureBucketing";
import UserCreation from "./Client/Pages/UAM/UserCreation";
import ExposureBucketings from "./Client/Pages/FX/exp";
import FXBookingDashboard from "./Client/Pages/FX/FXBookingDashboard";
import HedgingProposal from "./Client/Pages/FX/HedgingProposal";
import HedgingDashboard from "./Client/Pages/FX/HedgingDashboard";
import FXForwardBookingForm from "./Client/Pages/FX/FXForwardBookingForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserCreation />}></Route>
                <Route path="/exposure-upload" element={<ExposureUpload />}></Route>
                <Route path="/exposure-bucketing" element={<ExposureBucketing />}></Route>
                <Route path="/FXBookingDashboard" element={<FXBookingDashboard />}></Route>
                <Route path="/exposure-bucketings" element={<ExposureBucketings />}></Route>
                <Route path="/hedging-proposal" element={<HedgingProposal />}></Route>
                <Route path="/hedging-dashboard" element={<HedgingDashboard />}></Route>
                <Route path="/fxbooking" element={<FXForwardBookingForm />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

