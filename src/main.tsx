import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { router } from "./routes/routes";
import { TicketProvider } from "./context/useContextTicket";

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
    <TicketProvider>
      <RouterProvider router={router} />
    </TicketProvider>
  </ApolloProvider>
);
