import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { HomePage } from "./pages/Home";
import ProfilePage from "./pages/Profile";
import { SettingsPage } from "./pages/Settings";
import BotsPage from "./pages/Bots";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { HomeLayout } from "./components/HomeLayout";
import Bot from "./components/Bot";
import Log from "./components/Log";
import NewBot from "./components/NewBot";


export default function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="bots" element={<BotsPage />} />
        <Route path="bots/:botId" element={<Bot />} />
        <Route path="bots/log/:botId" element={<Log />} />
        <Route path="bots/newbot" element={<NewBot />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
