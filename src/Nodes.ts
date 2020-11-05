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
  ModulesDB,
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

/*const {
  connectionType: CommentsConnection,
  edgeType: GraphQLCommentEdge,
} = connectionDefinitions({
  name: "Comment",
  nodeType: GraphQLComment,
});*/

const GraphQLModules = new GraphQLObjectType<ModulesDB>({
  name: "Modules",
  fields: {
    id: globalIdField("Modules"),
    QuickStart: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ QuickStart }): number => QuickStart,
    },
    HTML: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ HTML }): number => HTML,
    },
    CSS: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ CSS }): number => CSS,
    },
    Javascript: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ Javascript }): number => Javascript,
    },
    React: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ React }): number => React,
    },
    Node: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ Node }): number => Node,
    },
    Express: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ Express }): number => Express,
    },
    MongoDB: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ MongoDB }): number => MongoDB,
    },
  },
  interfaces: [nodeInterface],
});

const GraphQLUser = new GraphQLObjectType<RootUser, Context>({
  name: "User",
  fields: {
    id: globalIdField("User"),
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ username }): string => username,
    },
    currentTopic: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ topic }): string => {
        return topic;
      },
    },
    currentModules: {
      type: new GraphQLNonNull(GraphQLModules),
      resolve: ({ modules }): ModulesDB => {
        return modules;
      },
    },
  },
  interfaces: [nodeInterface],
});

export {
  nodeField,
  GraphQLComment,
  //GraphQLCommentEdge,
  GraphQLUser,
  GraphQLCommentOnComment,
  GraphQLCommentOnCommentEdge,
  //GraphQLHomework,
  //GraphQLHomeworkEdge,
  //GraphQLTopicEdge,
};
