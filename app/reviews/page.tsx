import Link from "next/link";
import Heading from "@/components/Heading";
import { getReviews, getSearchableReviews } from "@/lib/review";
import Image from "next/image";
import PaginationBar from "@/components/PaginationBar";
import SearchBox from "@/components/SearchBox";

export const metadata = {
  title: 'Reviews',
}

// export const dynamic = 'force-dynamic';
// revalidate at page level
// export const revalidate = 30; // seconds

const PAGE_SIZE = 6;

export default async function ReviewsPage({ searchParams }) {
  const page = parsePageParam(searchParams.page)
  const { reviews, pageCount } = await getReviews(PAGE_SIZE, page);
  // const searchableReviews = await getSearchableReviews();

  return (
    <>
      <Heading>Reviews</Heading>
      <div className="flex justify-between pb-3">
        <PaginationBar href="/reviews" page={page} pageCount={pageCount}/>
        <SearchBox 
          // reviews={searchableReviews} 
        />
      </div>
      <ul className="flex flex-row flex-wrap gap-3">
        {reviews.map((review: Record<string, any>, index: number) => (
          <li key={review.slug} className="border w-80 bg-white rounded shadow hover:shadow-xl">
            <Link href={`/reviews/${review.slug}`}>
              <Image src={review.image} alt="" priority={index === 0} width="640" height="360" className="mb-2 rounded-t"/>
              <h2 className="py-1 text-center font-orbitron font-semibold">
                {review.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function parsePageParam(paramValue: string) {
  if (paramValue) {
    const page = parseInt(paramValue);
    if (isFinite(page) && page > 0) {
      return page;
    }
  }
  return 1;
}