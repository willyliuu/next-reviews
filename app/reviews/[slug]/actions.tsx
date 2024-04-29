'use server';

import { createComment } from "@/lib/comments";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCommentAction(formData: FormData) {
  if (!formData.get('user')) {
    return { isError: true, message: 'Name field is required' };
  }

  const data = {
    slug: formData.get('slug'),
    user: formData.get('user'),
    message: formData.get('message'),
  }
  const message = await createComment(data);
  console.log('created:', message);
  revalidatePath(`/reviews/${data.slug}`);
  redirect(`/reviews/${data.slug}`);
}