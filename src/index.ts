import express from "express";
import graphqlHTTP from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { ATLAS_CONFIG } from "./config";
import { nodeField } from "./Nodes";
import { UserQuery } from "./Query/User";
import { AddCommentMutation } from "./Mutation/AddComment";
import { AddCommentOnCommentMutation } from "./Mutation/AddCommentOnComment";
//import { AddHomeworkMutation } from "./Mutation/AddHomework";
import { MongoClient } from "mongodb";
import { UserDB, CommentsDB, TopicDB, Context } from "./Database";
import SingUpMutation from "./Mutation/SignUp";
import SingInMutation from "./Mutation/SignIn";
import UpdateCurrentModuleMutation from "./Mutation/UpdateCurrentModule";
import UpdateCurrentTopicMutation from "./Mutation/UpdateCurrentTopic";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: UserQuery,
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    SignIn: SingInMutation,
    SignUp: SingUpMutation,
    addComment: AddCommentMutation,
    addCommentOnComment: AddCommentOnCommentMutation,
    updateCurrentModule: UpdateCurrentModuleMutation,
    UpdateCurrentTopic: UpdateCurrentTopicMutation,
  },
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

const app = express();

app.use(cors());

const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const mongodb = MongoClient.connect(ATLAS_CONFIG || "", menuOptions);

app.use(
  "/graphql",
  graphqlHTTP(
    async (
      res
    ): Promise<{
      schema: GraphQLSchema;
      graphiql: true;
      context: Context;
    }> => {
      const db = (await mongodb).db("amigo_programador");
      const usuarios = db.collection<UserDB>("usuarios");
      const comentarios = db.collection<CommentsDB>("comentarios");
      const arbol = db.collection<TopicDB>("arbo_tecnologicol");
      return {
        schema: schema,
        graphiql: true,
        context: {
          usuarios,
          comentarios,
          arbol,
          token: res.headers.authorization ? res.headers.authorization : "",
        },
      };
    }
  )
);

app.listen(process.env.PORT || 4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
