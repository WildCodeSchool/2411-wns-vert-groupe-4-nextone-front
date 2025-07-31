import { Link } from 'react-router'
import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
      <div className='bg-card font-archivo'>
        <Button asChild>
          <Link to="/about">À propos</Link>
        </Button>
      </div>
    </>
  )
}

export default App
