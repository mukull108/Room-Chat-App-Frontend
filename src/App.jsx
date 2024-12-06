import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast from 'react-hot-toast'
import JoinChat from './components/joinChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <JoinChat/>
    </div>
  )
}

export default App
