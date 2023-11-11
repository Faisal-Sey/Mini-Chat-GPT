import {Routes, Route} from "react-router-dom";
import LoginPage from "./auth/login/index.jsx";
import Signup from "./auth/signup/index.jsx";
import ChatSessionsPage from "./screens/sessions/index.jsx";
import PageWrapper from "./components/pagewrapper/index.jsx";
import './App.scss'
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <Routes>
        {/* Authentication */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Signup />} />

        {/* Chat */}
        <Route
            path="/sessions"
            exact
            element={
                <PageWrapper>
                    <ChatSessionsPage />
                </ PageWrapper>
            }
        />
        <Route
            path="/sessions/:id"
            exact
            element={
                <PageWrapper>
                    <ChatSessionsPage />
                </ PageWrapper>
            }
        />
    </Routes>
  )
}

export default App
