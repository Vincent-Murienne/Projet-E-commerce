import { RouterProvider } from "react-router-dom"
import router from "./services/router"
import { UserProvider } from "./context/UserProvider";


function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </>
  )
}

export default App
