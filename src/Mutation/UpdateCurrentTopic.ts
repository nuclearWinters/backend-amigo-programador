import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import { Context } from "../Database";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "./refreshTokenMiddleware";

interface Input {
  index: number;
  refreshToken: string;
}

type Payload = {
  topicIndex: number;
  error?: string;
  accessToken?: string;
};

const UpdateCurrentTopicMutation = mutationWithClientMutationId({
  name: "updateCurrentTopic",
  description: "Cambia el tema en curso del usuario.",
  inputFields: {
    index: { type: GraphQLNonNull(GraphQLInt) },
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => error || null,
    },
    topic: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ topicIndex }: Payload): number => topicIndex,
    },
    accessToken: {
      type: GraphQLString,
      resolve: ({ accessToken }: Payload): string | null => accessToken || null,
    },
  },
  mutateAndGetPayload: async (
    { index, refreshToken }: Input,
    { accessToken, usuarios }: Context
  ): Promise<Payload> => {
    try {
      if (!accessToken || !refreshToken)
        throw new Error("El usuario no tiene credenciales.");
      const { validAccessToken, _id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      usuarios.findOneAndUpdate(
        { _id: new ObjectID(_id) },
        { $set: { topic: index } }
      );
      return { topicIndex: index, accessToken: validAccessToken };
    } catch (e) {
      return { topicIndex: index, error: e.message };
    }
  },
});

export { UpdateCurrentTopicMutation };
