import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  ConnectionArguments,
} from "graphql-relay";

import {
  CommentDB,
  RootUser,
  CommentOnComment,
  fakeDatabaseQueryLikedComments,
  ModuleDB,
  TopicDB,
  Context,
} from "./Database";

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type } = fromGlobalId(globalId);
    return type;
  },
  (type: string): GraphQLObjectType | null => {
    switch (type) {
      case "User":
        return GraphQLUser;
      case "Comment":
        return GraphQLComment;
      case "CommentOnComment":
        return GraphQLCommentOnComment;
      case "Topics":
        return GraphQLTopic;
      case "Module":
        return GraphQLModule;
      default:
        return null;
    }
  }
);

const GraphQLCommentOnComment = new GraphQLObjectType({
  name: "CommentOnComment",
  fields: {
    id: globalIdField("CommentOnComment"),
    likes: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (comment: CommentOnComment): number => comment.likes,
    },
    comment: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: CommentOnComment): string => comment.comment,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: CommentOnComment): string => comment.name,
    },
    created: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: CommentOnComment): string => comment.created,
    },
    idParentComment: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: CommentOnComment): string => comment.idParentComment,
    },
    liked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (comment: CommentOnComment) => {
        return Boolean(
          fakeDatabaseQueryLikedComments.find(
            (item) =>
              item.idComment === comment.id && item.name === "Armando Rueda"
          )
        );
      },
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: CommentsOnCommentsConnection,
  edgeType: GraphQLCommentOnCommentEdge,
} = connectionDefinitions({
  name: "CommentOnComment",
  nodeType: GraphQLCommentOnComment,
});

/*const GraphQLComment = new GraphQLObjectType({
  name: "Comment",
  fields: {
    id: globalIdField("Comment"),
    likes: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (comment: Comment): number => comment.likes,
    },
    comment: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: Comment): string => comment.comment,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: Comment): string => comment.name,
    },
    created: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (comment: Comment): string => comment.created,
    },
    hasComments: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (comment: Comment): number => {
        const lenght = fakeDatabaseQueryCommentOnComment.filter(
          (item) => item.idParentComment === comment.id
        ).length;
        return lenght;
      },
    },
    liked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (comment: Comment) => {
        return Boolean(
          fakeDatabaseQueryLikedComments.find(
            (item) =>
              item.idComment === comment.id && item.name === "Armando Rueda"
          )
        );
      },
    },
    comments: {
      type: CommentsOnCommentsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (comment: Comment, args) => {
        const fakeDatabaseQueryCommentOnCommentCopy = fakeDatabaseQueryCommentOnComment.filter(
          (item) => item.idParentComment === comment.id
        );
        return connectionFromArray(fakeDatabaseQueryCommentOnCommentCopy, args);
      },
    },
  },
  interfaces: [nodeInterface],
});*/

const GraphQLComment = new GraphQLObjectType<CommentDB>({
  name: "Comment",
  fields: {
    id: globalIdField("Comment"),
    likes: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ likes }): number => likes,
    },
    comment: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ comment }): string => comment,
    },
    user_id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ user_id }): string => user_id,
    },
    created: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ created }): string => created,
    },
    totalSubcomments: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ totalSubcomments }): number => totalSubcomments,
    },
    /*liked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (comment: Comment) => {
        return Boolean(
          fakeDatabaseQueryLikedComments.find(
            (item) =>
              item.idComment === comment.id && item.name === "Armando Rueda"
          )
        );
      },
    },*/
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: CommentsConnection,
  edgeType: GraphQLCommentEdge,
} = connectionDefinitions({
  name: "Comment",
  nodeType: GraphQLComment,
});

const GraphQLModule = new GraphQLObjectType<ModuleDB, Context>({
  name: "Module",
  fields: {
    id: globalIdField("Module"),
    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ title }): string => title,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ description }): string => description,
    },
    thumbnail: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ thumbnail }): string => thumbnail,
    },
    comments: {
      type: new GraphQLNonNull(CommentsConnection),
      args: {
        ...connectionArgs,
      },
      resolve: async ({ comments }, args, { comentarios }) => {
        const commentsEmbedded = await comentarios.findOne({ _id: comments });
        return connectionFromArray(
          commentsEmbedded
            ? commentsEmbedded.allComments.map((item) => ({
                ...item,
                id: item._id.toHexString(),
              }))
            : [],
          args
        );
      },
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: ModulesConnection,
  edgeType: GraphQLModulesEdge,
} = connectionDefinitions({
  name: "Module",
  nodeType: GraphQLModule,
});

const GraphQLTopic = new GraphQLObjectType<TopicDB>({
  name: "Topic",
  fields: {
    id: globalIdField("Topic"),
    step: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ step }): number => step,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ name }): string => name,
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ url }): string => url,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ type }): string => type,
    },
    modules: {
      type: new GraphQLNonNull(ModulesConnection),
      args: {
        ...connectionArgs,
      },
      resolve: ({ modules }, args) => {
        return connectionFromArray(
          modules.map((item) => ({ ...item, id: item._id.toHexString() })),
          args
        );
      },
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: TopicsConnection,
  edgeType: GraphQLTopicEdge,
} = connectionDefinitions({
  name: "Topic",
  nodeType: GraphQLTopic,
});

const GraphQLUser = new GraphQLObjectType<RootUser, Context>({
  name: "User",
  fields: {
    id: globalIdField("User"),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ name }): string => name,
    },
    topics: {
      type: new GraphQLNonNull(TopicsConnection),
      args: {
        ...connectionArgs,
      },
      resolve: async (
        _,
        { first, after, last, before }: ConnectionArguments,
        { arbol }
      ) => {
        if (first || after || last || before) {
          const topicsDB = await arbol.find().toArray();
          const argsMock: ConnectionArguments = {};
          return connectionFromArray(
            topicsDB.map((item) => ({ ...item, id: item._id.toHexString() })),
            argsMock
          );
        }
        const topics = await arbol.find().toArray();
        return connectionFromArray(
          topics.map((item) => ({ ...item, id: item._id.toHexString() })),
          { first, after, last, before }
        );
      },
    },
    currentTopic: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ topic }): number => {
        return topic;
      },
    },
    currentModule: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ module }): number => {
        return module;
      },
    },
  },
  interfaces: [nodeInterface],
});

export {
  nodeField,
  GraphQLComment,
  GraphQLCommentEdge,
  GraphQLUser,
  GraphQLCommentOnComment,
  GraphQLCommentOnCommentEdge,
  //GraphQLHomework,
  //GraphQLHomeworkEdge,
  GraphQLTopicEdge,
};
