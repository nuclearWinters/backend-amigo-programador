import moment from "moment";
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

/*export class Comment {
  id: string;
  likes: number;
  comment: string;
  name: string;
  created: string;
  hasComments: number;
  constructor(
    id: string,
    likes: number,
    comment: string,
    name: string,
    created: string,
    hasComments: number
  ) {
    this.id = id;
    this.likes = likes;
    this.comment = comment;
    this.name = name;
    this.created = created;
    this.hasComments = hasComments;
  }
}*/

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

export interface ModuleDB {
  _id: ObjectId;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  comments: ObjectId;
}

export interface Context {
  usuarios: Collection<UserDB>;
  comentarios: Collection<CommentsDB>;
  arbol: Collection<TopicDB>;
  token: string;
}

export interface TopicDB {
  _id: ObjectId;
  name: string;
  step: number;
  url: string;
  type: string;
  modules: ModuleDB[];
}

export interface RootUser {
  id: string;
  name: string;
  email: string;
  topic: number;
  module: number;
}

export interface UserDB {
  _id: ObjectId;
  name: string;
  password: string;
  email: string;
  topic: number;
  module: number;
}

export interface DecodeJWT {
  id: string;
}

const fakeDatabaseQuery = [
  {
    id: "QWERT",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    hasComments: 1,
    likes: 1,
  },
  {
    id: "GFGGV",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Teresa Pérez",
    created: moment()
      .subtract(1, "hours")
      .toISOString(),
    hasComments: 0,
    likes: 1,
  },
  {
    id: "AKWKA",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(1, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKB",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(2, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKC",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(3, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(4, "days")
      .toISOString(),
    hasComments: 7,
    likes: 0,
  },
  {
    id: "AKWKE",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(5, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKF",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(6, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKG",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(7, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKH",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(8, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKI",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(9, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKJ",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(10, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
  {
    id: "AKWKK",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(11, "days")
      .toISOString(),
    hasComments: 0,
    likes: 0,
  },
];

const fakeDatabaseQueryCommentOnComment = [
  {
    id: "GJKDV",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 1,
  },
  {
    id: "GJKDA",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 0,
  },
  {
    id: "GJKDB",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 0,
  },
  {
    id: "GJKDC",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 0,
  },
  {
    id: "GJKDD",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 0,
  },
  {
    id: "GJKDE",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
    likes: 0,
  },
  {
    id: "AZSCF",
    idParentComment: "AKWKD",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Teresa Pérez",
    created: moment()
      .subtract(1, "hours")
      .toISOString(),
    likes: 0,
  },
  {
    id: "VLONG",
    idParentComment: "QWERT",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic exercitationem officia beatae consectetur mollitia? Odit, ullam iure dolores neque molestias magnam fugiat impedit facere nemo sit veniam doloribus distinctio blanditiis.",
    name: "Fernando Rueda",
    created: moment()
      .subtract(1, "days")
      .toISOString(),
    likes: 1,
  },
];

const fakeDatabaseQueryLikedComments = [
  {
    id: "DGFBG",
    idComment: "QWERT",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
  },
  {
    id: "SFGSB",
    idComment: "GJKDV",
    name: "Armando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
  },
  {
    id: "SFBGS",
    idComment: "GFGGV",
    name: "Fernando Rueda",
    created: moment()
      .subtract(1, "minutes")
      .toISOString(),
  },
];

const fakeUsers = [
  { id: "GHRTR", name: "Armando Rueda" },
  { id: "JTTYK", name: "Fernando Rueda" },
  { id: "AQWEV", name: "Teresa Pérez" },
];

const fakeHomework = [
  { id: "GHRTD", name: "Armando Rueda" },
  { id: "JTTYS", name: "Fernando Rueda" },
  { id: "AQWEA", name: "Teresa Pérez" },
];

export {
  fakeDatabaseQuery,
  fakeDatabaseQueryLikedComments,
  fakeUsers,
  fakeDatabaseQueryCommentOnComment,
  fakeHomework,
};
