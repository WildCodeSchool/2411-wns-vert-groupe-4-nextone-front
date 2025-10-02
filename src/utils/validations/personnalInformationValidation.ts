import * as yup from "yup";

export const persoInfo = yup.object().shape({
    name: yup.string().required("Le nom est obligatoire"),
    firstName: yup.string().required("Le prénom est obligatoire"),
});

export const contactInfo = yup.object({
    email: yup.string().email("Adresse email invalide").required("Email requis"),
    phone: yup
        .string()
        .required("Téléphone requis")
        .matches(/^[0-9+\- ]{10,15}$/, "Numéro de téléphone invalide"),
        
    rgpdAccepted: yup.boolean().default(false).oneOf([true], "Vous devez accepter la RGPD"),
});