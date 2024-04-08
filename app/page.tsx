import Heading from '@/components/Heading'
import { getReviews } from '@/lib/review'
import Image from 'next/image';
import Link from 'next/link'

// export const dynamic = 'force-dynamic';
// export const revalidate = 30; // seconds

export default async function HomePage() {
  const {reviews: featuredReview} = await getReviews(3); 
  return (
    <>
      <Heading>Indie Games</Heading>
      <p className='pb-3'>The best indie games, review for you</p>
      <ul className='flex flex-col gap-3'>
        { featuredReview.map((review: Record<string, any>, index: number) => (
          <li key={review.slug} className="border w-80 sm:w-full bg-white rounded shadow hover:shadow-xl">
            <Link href={`/reviews/${review.slug}`} className='flex flex-col sm:flex-row'>
              <Image src={review.image} alt="" priority={index===0} width="640" height="360" className="mb-2 rounded-t sm:rounded-l sm:rounded-r-none" />
              <div className='px-2 py-1 text-center sm:text-left'>
              <h2 className="py-1 text-center font-orbitron font-semibold sm:px-2">
                {review.title}
              </h2>
              <p className='hidden pt-2 sm:block'>
                {review.subtitle}
              </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}