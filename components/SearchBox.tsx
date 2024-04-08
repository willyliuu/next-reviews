'use client';

import { Combobox } from "@headlessui/react"
import { useIsClient } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from 'use-debounce'
import { searchReviews } from "@/lib/review";

export default function SearchBox(
  // { reviews }
) {
  const router = useRouter()
  const isClient = useIsClient();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      const controller = new AbortController();
      (async () => {
        const url = '/api/search?query=' + encodeURIComponent(debouncedQuery)
        const response = await fetch(url, {signal: controller.signal })
        const reviews = await response.json()
        setReviews(reviews);
      })()
      return () => controller.abort();
    } else {
      setReviews([])
    }
  }, [debouncedQuery])
  const handleChange = (review: Record<string, any>) => {
    router.push(`/reviews/${review.slug}`)
  }

  if (!isClient) {
    return null;
  }

  /*
  const filtered = reviews.filter((review: Record<string, any>) => 
    review.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  */
  
  return (
    <div className="relative w-48">
      <Combobox onChange={handleChange}>
        <Combobox.Input placeholder="Search..."
          className="border px-2 py-1 rounded w-full"
          value={query} onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Options className="absolute bg-white py-1 w-full">
          {reviews.map((review) => (
            <Combobox.Option key={review.slug} value={review}>
              {({ active }) => (
                <span className={`block px-2 truncate w-full ${active ? 'bg-orange-100': ''}`}>
                  {review.title}
                </span>
              )}              
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}