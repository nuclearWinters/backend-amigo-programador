/*import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
  fromGlobalId,
} from "graphql-relay";
import uuid from "uuid/v4";
import { GraphQLNonNull, GraphQLString } from "graphql";
//import { GraphQLCommentOnCommentEdge } from "../Nodes";

import { fakeDatabaseQueryCommentOnComment } from "../Database";

type Input = {
  comment: string;
  name: string;
  created: string;
  idParentComment: string;
};

type Payload = {
  id: string;
};

function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const AddCommentOnCommentMutation = mutationWithClientMutationId({
  name: "AddCommentOnComment",
  inputFields: {
    comment: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    created: { type: new GraphQLNonNull(GraphQLString) },
    idParentComment: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    commentOnCommentEdge: {
      type: new GraphQLNonNull(GraphQLCommentOnCommentEdge),
      resolve: async ({ id }: Payload) => {
        const comment = fakeDatabaseQueryCommentOnComment.find(
          (item) => item.id === id
        );
        await sleep(5000);
        return {
          cursor: cursorForObjectInConnection(
            [...fakeDatabaseQueryCommentOnComment],
            comment
          ),
          node: comment,
        };
      },
    },
  },
  mutateAndGetPayload: ({
    comment,
    name,
    created,
    idParentComment,
  }: Input): Payload => {
    var { id } = fromGlobalId(idParentComment);
    let newComment = {
      id: uuid(),
      idParentComment: id,
      likes: 0,
      comment,
      name,
      created,
      liked: false,
    };
    fakeDatabaseQueryCommentOnComment.unshift(newComment);
    return { id: newComment.id };
  },
});

export { AddCommentOnCommentMutation };*/

export {};
