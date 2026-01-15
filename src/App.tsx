import { Layout } from 'antd'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import AuthDebugPage from './pages/AuthDebugPage'
import CharacterPage from './pages/CharacterPage'
import GamePage from './pages/GamePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const { Header, Content, Sider, Footer } = Layout

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <Layout className='min-h-screen'>
                <Header className='fixed w-full z-10' style={{ padding: 0 }}>
                  <Navigation />
                </Header>
                <Layout style={{ marginTop: 64 }}>
                  <Sider
                    width={220}
                    className='fixed left-0 h-full'
                    style={{
                      height: 'calc(100vh - 64px)',
                      top: 64,
                      backgroundColor: 'rgb(17, 24, 39)',
                      borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <Sidebar />
                  </Sider>
                  <Layout style={{ marginLeft: 220, minHeight: 'calc(100vh - 64px)' }}>
                    <Content className='bg-gray-50' style={{ padding: 0 }}>
                      <div className='ml-0'>
                        <Routes>
                          <Route path='/' element={<HomePage />} />
                          <Route path='/game/:characterId' element={<GamePage />} />
                          <Route path='/character' element={<CharacterPage />} />
                          <Route path='/profile' element={<ProfilePage />} />
                          <Route path='/debug' element={<AuthDebugPage />} />
                        </Routes>
                      </div>
                    </Content>
                    <Footer className='text-center border-t' style={{ backgroundColor: '#fff' }}>
                      重启人生 ©2025 Created by Restart Life Team
                    </Footer>
                  </Layout>
                </Layout>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
