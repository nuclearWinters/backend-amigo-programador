import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../Database";
import { jwt } from "./JWT";
import bcrypt from "bcryptjs";
import { REFRESHSECRET, ACCESSSECRET } from "../config";

interface Input {
  email: string;
  password: string;
}

type Payload = {
  refreshToken: string;
  accessToken: string;
  error?: string;
};

const SignInMutation = mutationWithClientMutationId({
  name: "signIn",
  description: "Obtén un Refresh Token y un AccessToken.",
  inputFields: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }: Payload): string | null => error || null,
    },
    refreshToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ refreshToken }: Payload): string => refreshToken,
    },
    accessToken: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ accessToken }: Payload): string => accessToken,
    },
  },
  mutateAndGetPayload: async (
    { email, password }: Input,
    { usuarios }: Context
  ): Promise<Payload> => {
    try {
      const user = await usuarios.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const refreshToken = await jwt.sign(
        { _id: user._id.toHexString() },
        REFRESHSECRET,
        { expiresIn: "1y" }
      );
      const accessToken = await jwt.sign(
        { _id: user._id.toHexString() },
        ACCESSSECRET,
        { expiresIn: "15m" }
      );
      return {
        refreshToken,
        accessToken,
      };
    } catch (e) {
      return {
        error: e.message,
        refreshToken: "",
        accessToken: "",
      };
    }
  },
});

export { SignInMutation };
