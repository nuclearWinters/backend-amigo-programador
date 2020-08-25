import { GraphQLString, GraphQLNonNull } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from "../Database";

const SignIn = {
  type: GraphQLNonNull(GraphQLString),
  description: "Obtener un JWT",
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: any, { email, password }: any, { usuarios }: Context) => {
    try {
      const user = await usuarios.findOne({ email });
      if (!user) throw new Error("El usuario no existe.");
      const hash = await bcrypt.compare(password, user.password);
      if (!hash) throw new Error("La contraseña no coincide.");
      const token = jwt.sign({ id: user._id.toHexString() }, user.password);
      return token;
    } catch (e) {
      return "";
    }
  },
};

export default SignIn;
