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
  uri: process.env.VITE_API_URL,
});

client
  .query({
    query: gql`
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `,
  })
  .then((response) => {
    console.log("GraphQL API is reachable with response.", response);
    console.log("Introspection response:", response.data.__schema.types);
  })
  .catch((error) => console.error(error));

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <TicketProvider>
      <RouterProvider router={router} />
    </TicketProvider>
  </ApolloProvider>
);
