import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExposureBucketing from "./Client/Pages/FX/ExposureBucketing";
import ExposureUpload from "./Client/Pages/FX/ExposureUpload";
import UserCreation from "./Client/Pages/UAM/UserCreation";
// import ExposureBucketings from "./Client/Pages/FX/exp";
import Entity from "./Client/Pages/FX/EntityCreationForm";
import EntityGraphics from "./Client/Pages/FX/EntityGraphics";
import FXBookingDashboard from "./Client/Pages/FX/FXBookingDashboard";
import FXForwardBookingForm from "./Client/Pages/FX/FXForwardBookingForm";
import FxStatus from "./Client/Pages/FX/FxStatus";
import HedgingDashboard from "./Client/Pages/FX/HedgingDashboard";
import HedgingProposal from "./Client/Pages/FX/HedgingProposal";
import Login from './Client/Pages/Login';
import Masters from "./Client/Pages/MASTERS/Masters";
import Permissions from "./Client/Pages/UAM/Assign-permission";
import Roles from "./Client/Pages/UAM/Role";


// import FXBookingDashboard from "./Client/Pages/FX/FXBookingDashboard";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/landing" element={<UserCreation />}></Route>
                <Route path="/user-creation" element={<UserCreation />}></Route>
                <Route path="/entity" element={<Entity />}></Route>
                <Route path="/hierarchical" element={<EntityGraphics />}></Route>
                <Route path="/roles" element={<Roles />}></Route>
                <Route path="/permissions" element={<Permissions />}></Route>
                <Route path="/exposure-upload" element={<ExposureUpload />}></Route>
                <Route path="/exposure-bucketing" element={<ExposureBucketing />}></Route>
                <Route path="/FXBookingDashboard" element={<FXBookingDashboard />}></Route>
                <Route path="/FxStatusDash" element={<FXBookingDashboard />}></Route>
                <Route path="/hedging-proposal" element={<HedgingProposal />}></Route>
                <Route path="/hedging-dashboard" element={<HedgingDashboard />}></Route>
                <Route path="/fxbooking" element={<FXForwardBookingForm />}></Route>
                <Route path="/fxstatus" element={<FxStatus />}></Route>
                <Route path="/masters" element={<Masters />}></Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;

