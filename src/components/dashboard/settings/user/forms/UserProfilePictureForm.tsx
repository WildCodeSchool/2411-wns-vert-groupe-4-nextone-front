import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import placeholderProfile from "@/assets/images/placeHolderProfile.jpg";

export default function UserProfilePictureForm() {
  const userProfilePictureSchema = yup.object().shape({
    profilePicture: yup
      .mixed()
      .required("Vous devez sélectionner un fichier")
      .test("fileSize", "Le fichier est trop volumineux", (value) => {
        if (!value) return true;
        const files = value as FileList;
        return files && files[0].size <= 2000000;
      })
      .test(
        "type",
        "Uniquement les formats suivants: .jpeg, .jpg, .png",
        (value) => {
          if (!value) return true;
          const files = value as FileList;
          return (
            files &&
            (files[0].type === "image/jpeg" ||
              files[0].type === "image/jpg" ||
              files[0].type === "image/png")
          );
        }
      ),
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
  
  const url_api = import.meta.env.VITE_ORIGIN_URL as string;

  const onSubmit = async (data: any) => {
    const file = data.profilePicture?.[0];
    if (!file) {
      return alert("Choisis une image !");
    }
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${url_api}managers/${user?.id}/profile-picture`,
      {
        method: "PUT",
        body: formData,
      }
    );
    await res.json();
    getInfos()
  };

  return (
    <>
      <InputWithLabel label="Photo de profil" {...register("profilePicture")} type="file" accept="image/png, image/jpeg" className="text-base! font-normal bg-transparent! shadow-none! w-full" error={errors.profilePicture?.message}>
      <img src={user?.profileImage 
      ? `${url_api}files/${encodeURIComponent(user.profileImage)}`
      : placeholderProfile} alt="Aperçu photo de profil" className="w-32 h-32 rounded-full object-cover"/>
      </InputWithLabel>
      <Button  type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid}>
        Enregistrer la photo de profil
      </Button>

    </>
  );
}
