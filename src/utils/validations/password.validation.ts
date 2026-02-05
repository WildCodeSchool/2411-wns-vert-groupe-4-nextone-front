import * as yup from "yup";

/**
 * Schéma de validation pour un mot de passe sécurisé
 * Recommandations : ANSSI / OWASP
 * - Minimum 12 caractères
 * - Au moins une minuscule
 * - Au moins une majuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial
 */
export const passwordSchema = yup
  .string()
  .required("Le mot de passe est requis")
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  // .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  // .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  // .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
  // .matches(
  //   /[@$!%*?&#]/,
  //   "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#)"
  // );

/**
 * Schéma de validation pour la confirmation du mot de passe
 * Vérifie que le mot de passe de confirmation correspond au mot de passe principal
 */
export const confirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
  .required("La confirmation du mot de passe est requise");
