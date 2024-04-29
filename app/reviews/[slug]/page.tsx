import Heading from "@/components/Heading";
import { notFound } from 'next/navigation'
import ShareLinkButton from "@/components/ShareLinkButton";
import { getReview, getSlugs } from "@/lib/review";
import Image from "next/image";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

export const dynamicParams = true; // default 
// export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({params: { slug }}) {
  const review = await getReview(slug);
  if (!review) {
  notFound()
  }
  return {
    title: review.title,
  }
}

export default async function ReviewPage({params: { slug }}) {
  const review = await getReview(slug);
  if (!review) {
    notFound()
  }
  const { title, date, image, body, subtitle } = review;
  return (
    <>
      <Heading>{title}</Heading>
      <p className="font-semibold pb-3">
        {subtitle}
      </p>
      <div className="flex gap-3 items-baseline">
      <p className="italic pb-2">{date}</p>
      <ShareLinkButton />
      </div>
      <Image src={image} alt="" width="640" height="360" className="mb-2 rounded" />
      <article dangerouslySetInnerHTML={{ __html: body }}
        className="prose prose-slate max-w-screen-sm"
      />
      <section className="border-dashed border-t max-w-screen-sm mt-3 py-3">
        <h2 className="font-bold flex gap-2 items-center text-xl">
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6"/>
          Comments
        </h2>
        <CommentForm slug={slug} title={title}/>
        <CommentList slug={slug}/>
      </section>
    </>
  ) 
}