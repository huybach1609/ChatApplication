import { NextUIProvider } from '@nextui-org/react'
import NaviticationBar from './components/default/navbar'
import CustomRouter from './routers/router'
import { WebSocketProvider } from './components/websocket/websocketContext'
import { API_URL } from './constrains'
import { BrowserRouter as Router } from 'react-router-dom'


function App() {

  return (
    <NextUIProvider className='h-full w-full flex flex-col'>
      <Router>

        <WebSocketProvider url={API_URL}>
          <div className='h-full w-full flex '>
            <div className="sm:w-[300px] w-[30%] pt-5 px-5 flex flex-col gap-2 h-[100vh] "><NaviticationBar /></div>
            <div className="flex-1"><CustomRouter /></div>
          </div>
        </WebSocketProvider>
      </Router>
    </NextUIProvider>
  )
}

export default App
