import { Layout } from 'antd'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import Sidebar from './components/Sidebar'
import CharacterPage from './pages/CharacterPage'
import GamePage from './pages/GamePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const { Header, Content, Sider } = Layout

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页面不需要导航栏 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 带导航栏的页面 */}
        <Route path="/*" element={
          <Layout className="min-h-screen">
            <Header className="fixed w-full z-10" style={{ padding: 0 }}>
              <Navigation />
            </Header>
            <Layout style={{ marginTop: 64 }}>
              <Sider
                width={200}
                className="fixed left-0 h-full"
                style={{
                  height: 'calc(100vh - 64px)',
                  top: 64,
                  backgroundColor: 'rgb(17, 24, 39)',
                  borderRight: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Sidebar />
              </Sider>
              <Layout style={{ marginLeft: 200 }}>
                <Content className="bg-gray-50 min-h-screen">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game/:characterId" element={<GamePage />} />
                    <Route path="/character" element={<CharacterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
