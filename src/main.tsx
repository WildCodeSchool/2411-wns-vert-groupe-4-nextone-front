import { createRoot } from "react-dom/client";
import { redirect, RouterProvider } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  from,
  gql,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { router } from "./routes/routes";
import ToasterProvider from "./components/ui/toaster";
import { TicketProvider } from "./context/useContextTicket";
import AuthProvider from "./context/AuthContext";
import { onError } from "@apollo/client/link/error";

const uri = import.meta.env.VITE_API_URL as string;

const httpLink = new HttpLink({
  uri,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: uri.replace("http", "ws"),
    connectionParams: {},
  })
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message === "Non autorisé."
      ) {
        console.warn("Token expiré ou invalide — redirection vers login");
        localStorage.removeItem("user");
        redirect("/login");
      }
    }
  }

  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    redirect("/login");
  }
});

const httpWithErrorLink = from([errorLink, httpLink]);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpWithErrorLink
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([splitLink]),
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
    fetchPolicy: "network-only",
  })
  .then((response) => {
    console.log("GraphQL API is reachable. Response:", response);
  })
  .catch((error) => console.error(error));

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <TicketProvider>
        <ToasterProvider />
        <RouterProvider router={router} />
      </TicketProvider>
    </AuthProvider>
  </ApolloProvider>
);
