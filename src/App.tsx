import { Link } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import ToasterProvider from './components/ui/toaster'

function App() {

  return (
    <>
      <ToasterProvider />
      <div className='bg-card font-archivo'>
        <Button asChild>
          <Link to="/about">À propos</Link>
        </Button>
      </div>
    </>
  )
}

export default App
