import { Layout } from 'antd'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import AuthDebugPage from './pages/AuthDebugPage'
import CharacterPage from './pages/CharacterPage'
import GamePage from './pages/GamePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页面不需要导航栏 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 带导航栏和路由保护的页面 */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout className="min-h-screen">
              <Header>
                <Navigation />
              </Header>
              <Content className="flex-1" style={{ padding: '0', minHeight: 'calc(100vh - 64px - 69px)' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/game/:characterId" element={<GamePage />} />
                  <Route path="/character" element={<CharacterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/debug" element={<AuthDebugPage />} />
                </Routes>
              </Content>
              <Footer className="text-center">
                重启人生 ©2025 Created by Restart Life Team
              </Footer>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
