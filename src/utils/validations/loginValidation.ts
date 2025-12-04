import * as yup from "yup";

export const loginInfo = yup.object({
    email: yup.string().email("Adresse email invalide").required("Email requis"),
    password: yup.string().required("Le mot de passe est obligatoire").min(6, "6 caractères minimum"),
});
