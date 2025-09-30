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

const uri = import.meta.env.DEV
  ? "http://localhost:4005/graphql"
  : "https://david4.wns.wilders.dev/graphql";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  uri: uri,
});

client
  .query({
    query: gql`
      query Companies {
        companies {
          address
          city
        }
      }
    `,
  })
  .then((response) => {
    console.log("GraphQL API is reachable. Response:", response);
  })
  .catch((error) => console.error(error));

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <TicketProvider>
      <RouterProvider router={router} />
    </TicketProvider>
  </ApolloProvider>
);
