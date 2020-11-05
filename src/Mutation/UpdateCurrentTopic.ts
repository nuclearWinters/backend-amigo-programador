import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../Database";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "./refreshTokenMiddleware";

interface Input {
  topic: string;
  refreshToken: string;
}

type Payload = {
  topic: string;
  error?: string;
  accessToken?: string;
};

const UpdateCurrentTopicMutation = mutationWithClientMutationId({
  name: "UpdateCurrentTopic",
  description: "Cambia el tema en curso del usuario.",
  inputFields: {
    topic: { type: GraphQLNonNull(GraphQLString) },
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => error || null,
    },
    topic: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ topic }: Payload): string => topic,
    },
    accessToken: {
      type: GraphQLString,
      resolve: ({ accessToken }: Payload): string | null => accessToken || null,
    },
  },
  mutateAndGetPayload: async (
    { topic, refreshToken }: Input,
    { accessToken, usuarios }: Context
  ): Promise<Payload> => {
    try {
      if (!accessToken || !refreshToken)
        throw new Error("El usuario no tiene credenciales.");
      const { validAccessToken, _id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      await usuarios.findOneAndUpdate(
        { _id: new ObjectID(_id) },
        { $set: { topic } }
      );
      return { topic, accessToken: validAccessToken };
    } catch (e) {
      return { topic, error: e.message };
    }
  },
});

export { UpdateCurrentTopicMutation };
