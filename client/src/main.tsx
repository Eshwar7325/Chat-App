import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from "../context/AuthContext.tsx";
import { ChatProvider } from "../context/chatContext.tsx";

createRoot(document.getElementById('root')!).render(
  <Router>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </Router>,
)
