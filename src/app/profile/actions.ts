"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to update your profile.",
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.updateUser({
    email,
    data: {
      full_name: name,
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/profile");

  return {
    success: "Profile updated successfully.",
  };
}

export async function updateAvatar(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to update your avatar.",
    };
  }

  const avatarFile = formData.get("avatar") as File;
  const filePath = `${user.id}/avatar-${Date.now()}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, avatarFile, { upsert: true });

  if (uploadError) {
    return {
      error: "Failed to upload avatar.",
    };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(uploadData.path);

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      avatar_url: publicUrl,
    },
  });

  if (updateUserError) {
    return {
      error: "Failed to update avatar URL.",
    };
  }

  revalidatePath("/profile");

  return {
    success: "Avatar updated successfully.",
  };
}