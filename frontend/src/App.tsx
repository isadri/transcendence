import BackGround from './components/background/BackGround'
import { RouterProvider} from "react-router-dom";
import './App.css'

import { useState } from 'react';
import mainRouter from './Routing/mainRouting';
import landingRouter from './Routing/landingrouting';

function App() {
  let [isLogged, setIsLogged] = useState(false);
  return (
    <>
      <BackGround isLogged={isLogged}>
        <RouterProvider router={ isLogged ? mainRouter : landingRouter} />
      </BackGround>
    </>
  )
}

export default App;