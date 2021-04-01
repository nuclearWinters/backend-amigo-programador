import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
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
  ModuleDB,
  Context,
  ModulesDB,
  TopicsDB,
} from "./Database";

import { topicsAndModules, commentsHC } from "./Data";

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
      case "Module":
        return GraphQLModule;
      default:
        return null;
    }
  }
);

/*const GraphQLCommentOnComment = new GraphQLObjectType({
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
});*/

/*const {
  connectionType: CommentsOnCommentsConnection,
  edgeType: GraphQLCommentOnCommentEdge,
} = connectionDefinitions({
  name: "CommentOnComment",
  nodeType: GraphQLCommentOnComment,
});*/

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

const GraphQLModules = new GraphQLObjectType<ModulesDB>({
  name: "Modules",
  fields: {
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
});

const GraphQLModule = new GraphQLObjectType<ModuleDB>({
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
        refreshToken: { type: GraphQLString },
      },
      resolve: async (
        { comments },
        args: ConnectionArguments,
        { comentarios }
      ) => {
        console.log(args.first);
        console.log(args.last);
        console.log(args.after);
        console.log(args.before);
        if (args.first === 0) {
          return connectionFromArray<CommentDB>(comments, args);
        } else {
          return connectionFromArray<any>(commentsHC, args);
        }
      },
    },
  },
  interfaces: [nodeInterface],
});

const GraphQLTopics = new GraphQLObjectType<TopicsDB>({
  name: "Topics",
  fields: {
    QuickStart: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ QuickStart }): ModuleDB[] => QuickStart,
    },
    HTML: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ HTML }): ModuleDB[] => HTML,
    },
    CSS: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ CSS }): ModuleDB[] => CSS,
    },
    Javascript: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ Javascript }): ModuleDB[] => Javascript,
    },
    React: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ React }): ModuleDB[] => React,
    },
    Node: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ Node }): ModuleDB[] => Node,
    },
    Express: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ Express }): ModuleDB[] => Express,
    },
    MongoDB: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLModule))
      ),
      resolve: ({ MongoDB }): ModuleDB[] => MongoDB,
    },
  },
});

const GraphQLUser = new GraphQLObjectType<RootUser, Context>({
  name: "User",
  fields: {
    id: globalIdField("User"),
    topics: {
      type: new GraphQLNonNull(GraphQLTopics),
      resolve: (): TopicsDB => topicsAndModules,
    },
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

export { nodeField, GraphQLComment, GraphQLUser };
