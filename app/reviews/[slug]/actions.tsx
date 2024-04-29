'use server';

import { createComment } from "@/lib/comments";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCommentAction(formData: FormData) {
  const data = {
    slug: formData.get('slug'),
    user: formData.get('user'),
    message: formData.get('message'),
  }
  const error = validate(data)
  if (error) {
    return { isError: true, message: error}
  }
  const message = await createComment(data);
  console.log('created:', message);
  revalidatePath(`/reviews/${data.slug}`);
  redirect(`/reviews/${data.slug}`);
}

function validate(data: any) {
  if (!data.user) {
    return "Name field is required";
  }

  if (data.user.length > 5) {
    return 'Name field cannot be longer than 50 characters';
  }

  if (!data.message) {
    return "Comment field is required";
  }

  if (data.message.length > 500) {
    return 'Comment field cannot be longer than 500 characters';
  }
}