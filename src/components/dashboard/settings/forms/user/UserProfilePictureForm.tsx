import InputWithLabel from "@/components/dashboard/InputWithLabel";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

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

  const onSubmit = (data: UserProfilePictureFormData) => {
    console.log(data);
  };

  return (
    <>
      <InputWithLabel
        label="Photo de profil"
        {...register("profilePicture")}
        type="file"
        accept="image/png, image/jpeg"
        className="!text-base font-normal !bg-transparent !shadow-none w-full"
        error={errors.profilePicture?.message}
      />
      <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
        Enregistrer la photo de profil
      </Button>
    </>
  );
}
