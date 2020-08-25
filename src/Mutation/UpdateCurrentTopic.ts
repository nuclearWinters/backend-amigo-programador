import { GraphQLInt, GraphQLNonNull } from "graphql";
import jwt from "jsonwebtoken";
import { Context, DecodeJWT } from "../Database";
import { ObjectID } from "mongodb";

const UpdateCurrentTopic = {
  type: GraphQLNonNull(GraphQLInt),
  description: "Crear un usuario y obtener un JWT",
  args: {
    index: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: async (_: any, { index }: any, { usuarios, token }: Context) => {
    try {
      if (!token) throw new Error("El usuario no tiene cuenta.");
      const decoded = jwt.decode(token);
      const user = await usuarios.findOne({
        _id: new ObjectID((decoded as DecodeJWT).id),
      });
      if (!user) throw new Error("El usuario no existe.");
      jwt.verify(token, user.password);
      usuarios.findOneAndUpdate(
        { _id: new ObjectID((decoded as DecodeJWT).id) },
        { $set: { topic: index } }
      );
      return index;
    } catch (e) {
      return index;
    }
  },
};

export default UpdateCurrentTopic;
