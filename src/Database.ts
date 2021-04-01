import { ObjectId, Db, Collection } from "mongodb";

export class CommentOnComment {
  id: string;
  likes: number;
  comment: string;
  name: string;
  created: string;
  idParentComment: string;
  constructor(
    id: string,
    likes: number,
    comment: string,
    name: string,
    created: string,
    idParentComment: string
  ) {
    this.id = id;
    this.likes = likes;
    this.comment = comment;
    this.name = name;
    this.created = created;
    this.idParentComment = idParentComment;
  }
}

export interface CommentDB {
  _id: ObjectId;
  id: string;
  likes: number;
  comment: string;
  user_id: string;
  created: string;
  totalSubcomments: number;
}

export interface CommentsDB {
  _id: ObjectId;
  allComments: {
    _id: ObjectId;
    likes: number;
    comment: string;
    user_id: string;
    created: string;
    totalSubcomments: number;
  }[];
}

export interface Context {
  usuarios: Collection<UserDB>;
  comentarios: Collection<CommentsDB>;
  accessToken?: string;
}

export interface RootUser {
  id: string;
  username: string;
  email: string;
  topic: string;
  modules: ModulesDB;
}

export interface UserDB {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
  topic: string;
  modules: ModulesDB;
}

export interface DecodeJWT {
  _id: string;
}

export interface ModulesDB {
  QuickStart: number;
  HTML: number;
  CSS: number;
  Javascript: number;
  React: number;
  Node: number;
  Express: number;
  MongoDB: number;
}

export interface ModuleDB {
  title: string;
  description: string;
  thumbnail: string;
  comments: any[];
}

export interface TopicsDB {
  QuickStart: ModuleDB[];
  HTML: ModuleDB[];
  CSS: ModuleDB[];
  Javascript: ModuleDB[];
  React: ModuleDB[];
  Node: ModuleDB[];
  Express: ModuleDB[];
  MongoDB: ModuleDB[];
}
