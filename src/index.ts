import express from "express";
import graphqlHTTP from "express-graphql";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { ATLAS_CONFIG } from "./config";
import { nodeField } from "./Nodes";
import { UserQuery } from "./Query/User";
//import { AddCommentMutation } from "./Mutation/AddComment";
//import { AddCommentOnCommentMutation } from "./Mutation/AddCommentOnComment";
//import { AddHomeworkMutation } from "./Mutation/AddHomework";
import { MongoClient, Db } from "mongodb";
import { UserDB, CommentsDB, Context } from "./Database";
import { SignUpMutation } from "./Mutation/SignUp";
import { SignInMutation } from "./Mutation/SignIn";
import { UpdateCurrentTopicMutation } from "./Mutation/UpdateCurrentTopic";
import { UpdateCurrentModuleMutation } from "./Mutation/UpdateCurrentModule";

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
    signIn: SignInMutation,
    signUp: SignUpMutation,
    //addComment: AddCommentMutation,
    //addCommentOnComment: AddCommentOnCommentMutation,
    updateCurrentTopic: UpdateCurrentTopicMutation,
    updateCurrentModule: UpdateCurrentModuleMutation,
  },
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

const app = express();

app.use(cors());

const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(
  "/graphql",
  graphqlHTTP((req: any): {
    context: Context;
    schema: GraphQLSchema;
    graphiql: boolean;
  } => {
    const db = req.app.locals.db as Db;
    const usuarios = db.collection<UserDB>("usuarios");
    const comentarios = db.collection<CommentsDB>("comentarios");
    return {
      schema: schema,
      graphiql: true,
      context: {
        usuarios,
        comentarios,
        accessToken: req.headers.authorization,
      },
    };
  })
);

MongoClient.connect(ATLAS_CONFIG, menuOptions).then((client) => {
  const db = client.db("amigo_programador");
  app.locals.db = db;
  app.listen(process.env.PORT || 4000, () => {
    console.log(
      `Running a GraphQL API server at http://localhost:4000/graphql`
    );
  });
});
