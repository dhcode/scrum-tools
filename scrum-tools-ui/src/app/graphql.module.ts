import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { type ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

const uri = `${location.protocol.replace('http', 'ws')}//${location.host}/graphql`; // <-- add the URL of the GraphQL server here
export function createApollo(): ApolloClientOptions<any> {
  const client = new SubscriptionClient(uri, {
    reconnect: true,
  });
  return {
    link: new WebSocketLink(client),
    cache: new InMemoryCache(),
    assumeImmutableResults: false,
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
    },
  ],
})
export class GraphQLModule {}
