import { GraphQLString } from "graphql";
import { GraphQLUser } from "../Nodes";
import { RootUser, DecodeJWT, Context } from "../Database";
import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";

const UserQuery = {
  type: GraphQLUser,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (
    _: any,
    { id }: any,
    { usuarios, token }: Context
  ): Promise<RootUser> => {
    try {
      if (!id) throw new Error("No ingreso un usuario");
      if (!token) throw new Error("El usuario no tiene cuenta.");
      const decoded = jwt.decode(token);
      if (id !== (decoded as DecodeJWT).id)
        throw new Error("El usuario no es el mismo que esta autenticado");
      const user = await usuarios.findOne({
        _id: new ObjectID(id),
      });
      if (!user) throw new Error("El usuario no existe.");
      jwt.verify(token, user.password);
      return {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        topic: user.topic,
        module: user.module,
      };
    } catch (e) {
      const user = {
        id: "",
        name: "",
        email: "",
        topic: 0,
        module: 0,
      };
      return user;
    }
  },
};

export { UserQuery };
