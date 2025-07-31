import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, gql, InMemoryCache } from "@apollo/client";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/about",
    element: <div>Route test About</div>,
  }
]);

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false
  }),
  uri: "http://localhost:4005",
});

client
  .query({
    query: gql`
      query TestQuery {
        __typename
      }
    `
  })
  .then(response => console.log("Apollo Client is configured correctly:", response))
  .catch(error => console.error("Apollo Client configuration error:", error));

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={client}>
      <RouterProvider router={router}/>
    </ApolloProvider>
  );
