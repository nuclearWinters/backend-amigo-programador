import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../Database";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "../Mutation/refreshTokenMiddleware";

type Input = {
  topicIndex: number;
  name:
    | "QuickStart"
    | "HTML"
    | "CSS"
    | "Javascript"
    | "React"
    | "Node"
    | "Express"
    | "MongoDB";
  moduleIndex: number;
  refreshToken: string;
};

type Payload = {
  module: number;
  error?: string;
  accessToken?: string;
};

const UpdateCurrentModuleMutation = mutationWithClientMutationId({
  name: "updateCurrentModule",
  description: "Cambia el modulo inicial de cada tema",
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    moduleIndex: { type: new GraphQLNonNull(GraphQLInt) },
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => (error ? error : null),
    },
    module: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ module }: Payload): number => module,
    },
    accessToken: {
      type: GraphQLString,
      resolve: ({ accessToken }: Payload): string | null => accessToken || null,
    },
  },
  mutateAndGetPayload: async (
    { name, moduleIndex, refreshToken }: Input,
    { usuarios, accessToken }: Context
  ): Promise<Payload> => {
    try {
      if (!accessToken || !refreshToken)
        throw new Error("El usuario no tiene credenciales.");
      const { validAccessToken, _id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      const { value } = await usuarios.findOneAndUpdate(
        { _id: new ObjectID(_id) },
        { $set: { [`modules.${name}`]: moduleIndex } }
      );
      if (value === undefined)
        throw new Error("El usuario no tiene propiedades.");
      const { topic, modules } = value;
      if (topic === undefined || modules === undefined)
        throw new Error("El usuario no tiene topic o modules.");
      return { module: moduleIndex, accessToken: validAccessToken };
    } catch (e) {
      return { module: moduleIndex, error: e.message };
    }
  },
});

export { UpdateCurrentModuleMutation };
