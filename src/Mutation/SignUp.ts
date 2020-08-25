import { GraphQLString, GraphQLNonNull } from "graphql";
import { SEND_GRID } from "../config";
import jwt from "jsonwebtoken";
import { Context } from "../Database";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";

const SignUp = {
  type: GraphQLNonNull(GraphQLString),
  description: "Crear un usuario y obtener un JWT",
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (
    _: any,
    { name, password, email }: any,
    { usuarios }: Context
  ) => {
    try {
      const user = await usuarios.findOne({ email });
      if (user) throw new Error("El email ya esta siendo usado.");
      const hash_password = await bcrypt.hash(password, 12);
      await usuarios.insertOne({
        name,
        email,
        password: hash_password,
        topic: 0,
        module: 0,
      });
      const token = jwt.sign({ name, email }, hash_password);
      if (SEND_GRID) {
        sgMail.setApiKey(SEND_GRID);
        const msg = {
          to: email,
          from: "soporte@amigoprogramador.com",
          subject: "Sending with Twilio SendGrid is Fun",
          text: "and easy to do anywhere, even with Node.js",
          html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        sgMail.send(msg);
      }
      return token;
    } catch (e) {
      return "";
    }
  },
};

export default SignUp;
