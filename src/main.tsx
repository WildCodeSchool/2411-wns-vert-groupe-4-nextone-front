import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "./App.tsx";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from "@apollo/client";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import HomeDashboard from "./components/dashboard/HomeDashboard.tsx";
import LoginPageAdmin from "./pages/LoginPageAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    element: <DashboardLayout />,
    path: "/dashboard",
    children: [
      {
        index: true,
        element: <HomeDashboard />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPageAdmin />, 
  },
]);

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  uri: "http://localhost:4005/graphql",
});

client
  .query({
    query: gql`
      query Companies {
        companies {
          id
          name
          address
        }
      }
    `,
  })
  .then((response) =>
    console.log("Apollo Client is configured correctly:", response)
  )
  .catch((error) => console.error("Apollo Client configuration error:", error));

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
