import * as yup from "yup";
import { passwordSchema } from "./password.validation";

export const loginInfo = yup.object({
  email: yup.string().email("Adresse email invalide").required("Email requis"),
  password: passwordSchema,
});
