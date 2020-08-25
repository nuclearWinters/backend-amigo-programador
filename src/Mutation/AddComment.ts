import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
} from "graphql-relay";
import uuid from "uuid/v4";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { GraphQLCommentEdge } from "../Nodes";

import { fakeDatabaseQuery } from "../Database";

type Input = {
  comment: string;
  name: string;
  created: string;
};

type Payload = {
  id: string;
};

const AddCommentMutation = mutationWithClientMutationId({
  name: "AddComment",
  inputFields: {
    comment: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    created: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    commentEdge: {
      type: new GraphQLNonNull(GraphQLCommentEdge),
      resolve: ({ id }: Payload) => {
        const comment = fakeDatabaseQuery.find((item) => item.id === id);
        return {
          cursor: cursorForObjectInConnection([...fakeDatabaseQuery], comment),
          node: comment,
        };
      },
    },
  },
  mutateAndGetPayload: ({ comment, name, created }: Input): Payload => {
    let newComment = {
      id: uuid(),
      likes: 0,
      comment,
      name,
      created,
      hasComments: 0,
      liked: false,
    };
    fakeDatabaseQuery.unshift(newComment);
    return { id: newComment.id };
  },
});

export { AddCommentMutation };
