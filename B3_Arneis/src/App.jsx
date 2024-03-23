import { RouterProvider } from "react-router-dom"
import router from "./services/router"
import { UserProvider } from "./context/UserProvider";
import { ToastContainer } from "@react-spectrum/toast";
import { Provider, defaultTheme } from "@adobe/react-spectrum";


function App() {
  return (
    <>
      <Provider theme={defaultTheme}>
        <ToastContainer/>
        <UserProvider>
          <RouterProvider router={router}/>
        </UserProvider>
      </Provider>
    </>
  )
}

export default App
