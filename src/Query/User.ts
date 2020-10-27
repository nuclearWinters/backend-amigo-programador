import { GraphQLString } from "graphql";
import { GraphQLUser } from "../Nodes";
import { RootUser, Context } from "../Database";
import { ObjectID } from "mongodb";
import { refreshTokenMiddleware } from "../Mutation/refreshTokenMiddleware";

const UserQuery = {
  type: GraphQLUser,
  args: {
    id: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
  },
  resolve: async (
    _: any,
    { id, refreshToken }: any,
    { usuarios, accessToken }: Context
  ): Promise<RootUser> => {
    try {
      if (!accessToken || !refreshToken)
        throw new Error("El usuario no tiene credenciales.");
      const { validAccessToken, _id } = await refreshTokenMiddleware(
        accessToken,
        refreshToken
      );
      const user = await usuarios.findOne({
        _id: new ObjectID(_id),
      });
      if (!user) throw new Error("El usuario no existe.");
      return {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        topic: user.topic,
        module: user.module,
        modules: user.modules,
      };
    } catch (e) {
      const user = {
        id: "",
        name: "",
        email: "",
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
      };
      return user;
    }
  },
};

export { UserQuery };
