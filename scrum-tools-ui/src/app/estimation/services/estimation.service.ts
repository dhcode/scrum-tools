import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSessionArgs } from 'scrum-tools-api/estimate/estimation-requests';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { EstimationSession } from 'scrum-tools-api/estimate/estimation-models';
import { FetchResult } from 'apollo-link';
import { map } from 'rxjs/operators';

type CreateSessionResult = Pick<EstimationSession, 'id' | 'joinSecret' | 'adminSecret'>;

@Injectable({
  providedIn: 'root',
})
export class EstimationService {
  constructor(private apollo: Apollo, @Inject(LOCAL_STORAGE) private storage: StorageService) {}

  createSession(name: string): Observable<FetchResult<CreateSessionResult>> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createSession($name: String!) {
            createSession(name: $name, description: "") {
              id
              joinSecret
              adminSecret
            }
          }
        `,
        variables: {
          name,
        },
      })
      .pipe(map((result) => result.data));
  }

  getSessionInfo(id: string, joinSecret: string, adminSecret?: string) {
    return this.apollo.watchQuery({
      query: gql`
        query EstimationSession($id: ID!, $joinSecret: String!, $adminSecret: String) {
          estimationSession(id: $id, joinSecret: $joinSecret, adminSecret: $adminSecret) {
            id
            description
            joinSecret
            modifiedAt
            createdAt
            defaultOptions
            activeTopic {
              id
              name
              description
              options
            }
          }
        }
      `,
      variables: {
        id,
        joinSecret,
        adminSecret,
      },
    }).valueChanges;
  }

  joinSession(id: string, joinSecret: string, name: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation joinSession($id: ID!, $joinSecret: String!, $name: String!) {
          joinSession(id: $id, joinSecret: $joinSecret, name: $name) {
            id
            joinedAt
            lastSeenAt
            name
          }
        }
      `,
      variables: {
        id,
        joinSecret,
        name,
      },
    });
  }
}
