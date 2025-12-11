import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import placeholderProfile from "@/assets/images/placeHolderProfile.jpg";
import { useToast } from "@/hooks/use-toast";

export default function UserProfilePictureForm() {
  const userProfilePictureSchema = yup.object().shape({
    profilePicture: yup
      .mixed<FileList>()
      .test("required", "Vous devez sélectionner un fichier", (value) => {
        return value && (value as FileList).length > 0;
      })
      .test(
        "fileSize",
        "Le fichier est trop volumineux (max 2 Mo)",
        (value) => {
          if (!value || !(value as FileList).length) return true;
          const files = value as FileList;
          return files[0] && files[0].size <= 2000000;
        }
      )
      .test(
        "type",
        "Uniquement les formats suivants: .jpeg, .jpg, .png",
        (value) => {
          if (!value || !(value as FileList).length) return true;
          const files = value as FileList;
          const validTypes = ["image/jpeg", "image/jpg", "image/png"];
          return files[0] && validTypes.includes(files[0].type);
        }
      )
      .required("Vous devez sélectionner un fichier"),
  });

  type UserProfilePictureFormData = yup.InferType<
    typeof userProfilePictureSchema
  >;

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<UserProfilePictureFormData>({
    resolver: yupResolver(userProfilePictureSchema),
    mode: "onChange",
  });

  const { user, getInfos } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const url_api = import.meta.env.VITE_ORIGIN_URL as string;

  const onSubmit = async (data: UserProfilePictureFormData) => {
    const fileList = data.profilePicture as FileList;
    const file = fileList?.[0];
    if (!file) {
      toastError("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 2000000) {
      toastError("Le fichier est trop volumineux (max 2 Mo)");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toastError(
        "Format de fichier non supporté. Utilisez .jpeg, .jpg ou .png"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${url_api}/images/managers/${user?.id}/profile-picture`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) {
        let errorMessage = "Erreur lors de l'upload de l'image";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Erreur ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await res.json();
      await getInfos();
      toastSuccess("Photo de profil mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toastError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'upload de l'image"
      );
    }
  };

  return (
    <>
      <InputWithLabel
        label="Photo de profil"
        {...register("profilePicture")}
        type="file"
        accept="image/png, image/jpeg"
        className="text-base! font-normal bg-transparent! shadow-none! w-full"
        error={errors.profilePicture?.message}
      >
        <img
          src={
            user?.profileImage
              ? `${url_api}/images/files/${encodeURIComponent(
                  user.profileImage
                )}`
              : placeholderProfile
          }
          alt="Aperçu photo de profil"
          className="w-32 h-32 rounded-full object-cover"
        />
      </InputWithLabel>
      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid}
      >
        Enregistrer la photo de profil
      </Button>
    </>
  );
}
