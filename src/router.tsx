import {createBrowserRouter, RouterProvider} from "react-router-dom";

import AppShell from "./components/Layout/AppShell";
import Child from "./features/child/pages/Child";
import Donors from "./features/donor/pages/Donor";
import Lottery from "./features/lottery/pages/Lottery";



const router = createBrowserRouter([
    {
        path:"/",
        element: <AppShell />,
        children: [
            {
                path: "child",
                element: <Child />
            },
            {
                path: "donors",
                element: <Donors />
            },
            {
                path: "lottery",
                element: <Lottery />
            }

        ],

       
    }
  
],
// {basename: "/Christmas"}
);
export default function AppRouter(){
    return <RouterProvider router={router} />
}