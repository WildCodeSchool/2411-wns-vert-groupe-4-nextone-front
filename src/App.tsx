import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
      <div className='bg-card'>
        <Button onClick={() => alert('Hello World')}>Hello World</Button>
      </div>
    </>
  )
}

export default App
