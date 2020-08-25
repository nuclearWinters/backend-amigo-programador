import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
} from "graphql-relay";
import uuid from "uuid/v4";
import { GraphQLNonNull, GraphQLString } from "graphql";
//import { GraphQLHomeworkEdge } from "../Nodes";
//import jsdom from "jsdom";
import fs from "fs";
import path from "path";
import load from "load-script";

//const { JSDOM } = jsdom;

type Input = {
  id: any;
};

type Payload = {
  id: any;
};

const AddHomeworkMutation = mutationWithClientMutationId({
  name: "AddHomework",
  inputFields: {
    file: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }: Payload) => {
        console.log(id);
        return id;
      },
    },
  },
  mutateAndGetPayload: (input: Input): Payload => {
    console.log("INPUT", input);
    const UPLOAD_PATH = path.resolve(
      __dirname,
      "../../static/images/upload/prueba.html"
    );
    fs.readFile(UPLOAD_PATH, "utf8", function(err, html) {
      if (err) {
        throw err;
      }
      console.log("HMTL", html);
      //const dom = new JSDOM(html);
      //console.log(dom.window.document.querySelector("p")?.textContent);
    });
    const UPLOAD_PATH_JS = path.resolve(
      __dirname,
      "../../static/images/upload/prueba.js"
    );
    load("./prueba.js", function(err: any, script: any) {
      if (err) {
        console.log(err);
        // print useful message
      } else {
        console.log("SCRIPT", script); // Prints 'foo'.js'
        // use script
        // note that in IE8 and below loading error wouldn't be reported
      }
    });
    return { id: uuid() };
  },
});

export { AddHomeworkMutation };
