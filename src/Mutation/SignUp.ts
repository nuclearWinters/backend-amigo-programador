import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { SEND_GRID, ACCESSSECRET, REFRESHSECRET } from "../config";
import { jwt } from "./JWT";
import { Context } from "../Database";
import bcrypt from "bcryptjs";
import { sgMail } from "./SEND_GRID";
import { ObjectID } from "mongodb";

interface Input {
  username: string;
  email: string;
  password: string;
}

type Payload = {
  refreshToken: string;
  accessToken: string;
  error?: string;
};

const SignUpMutation = mutationWithClientMutationId({
  name: "SignUp",
  description:
    "Registra un nuevo usuario y obtén un Refresh Token y un AccessToken.",
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
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
    { email, password, username }: Input,
    { usuarios }: Context
  ): Promise<Payload> => {
    try {
      const user = await usuarios.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      const _id = new ObjectID();
      await usuarios.insertOne({
        _id,
        username,
        email,
        password: hash_password,
        topic: "QuickStart",
        modules: {
          QuickStart: 0,
          HTML: 0,
          CSS: 0,
          Javascript: 0,
          React: 0,
          Node: 0,
          Express: 0,
          MongoDB: 0,
        },
      });
      const refreshToken = await jwt.sign(
        { _id: _id.toHexString() },
        REFRESHSECRET,
        { expiresIn: "1y" }
      );
      const accessToken = await jwt.sign(
        { _id: _id.toHexString() },
        ACCESSSECRET,
        { expiresIn: "15m" }
      );
      const msg = {
        to: email,
        from: "soporte@amigoprogramador.com",
        subject: "Sending with Twilio SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      };
      sgMail.send(msg);
      return { refreshToken, accessToken };
    } catch (e) {
      return { refreshToken: "", accessToken: "", error: e.message };
    }
  },
});

/*const SignUp = {
  type: GraphQLNonNull(GraphQLString),
  description: "Crear un usuario y obtener un JWT",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    _: any,
    { name, password, email }: any,
    { usuarios }: Context
  ) => {
    try {
      const user = await usuarios.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      await usuarios.insertOne({
        name,
        email,
        password: hash_password,
        topic: 0,
        module: 0,
        modules: {
          QuickStart: 0,
          HTML: 0,
          CSS: 0,
          Javascript: 0,
          React: 0,
          Node: 0,
          Express: 0,
          MongoDB: 0,
        },
      });
      const token = jwt.sign({ name, email }, hash_password);
      if (SEND_GRID) {
        sgMail.setApiKey(SEND_GRID);
        const msg = {
          to: email,
          from: "soporte@amigoprogramador.com",
          subject: "Sending with Twilio SendGrid is Fun",
          text: "and easy to do anywhere, even with Node.js",
          html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        sgMail.send(msg);
      }
      return token;
    } catch (e) {
      return "";
    }
  },
};*/

export { SignUpMutation };
