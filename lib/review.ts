import 'server-only';

import { marked } from "marked";
import qs from 'qs';

export const CACHE_TAG_REVIEWS = 'reviews';

const CMS_URL = process.env.CMS_URL;

// export async function getFeaturedReview() {
//   const review = await getReviews(1);
//   return review[0];
// }

export async function getReview(slug: string) {
  /*
  const text = await readFile(`./content/reviews/${slug}.md`, 'utf8')
  const { content, data: {title, date, image} } = matter(text);
  const body = marked(content);
  return {title, date, image, body, slug};
  */

  const { data } = await fetchReviews({ 
    filters: { slug: { $eq: slug }},
    fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'], 
    populate: { image: { fields: ['url']}},
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 1, withCount: false },
  })
  if (data.length === 0) {
    return null;
  }
  const item = data[0];

  return {
    ...toReview(item),
    body: marked(item.attributes.body), 
  }

}

export async function getReviews(pageSize: number, page?: number) {
  /*
  const slugs = await getSlugs();
  const reviews = []
  for (const slug of slugs) {
    const review = await getReview(slug);
    reviews.push(review)
  }
  reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
  return reviews;
  */

  const { data, meta } = await fetchReviews({ 
    fields: ['slug', 'title', 'subtitle', 'publishedAt'], 
    populate: { image: { fields: ['url']}},
    sort: ['publishedAt:desc'],
    pagination: { pageSize, page },
  })
  return {
    pageCount: meta.pagination.pageCount,
    reviews: data.map(toReview),
  }
}

export async function getSlugs() {
  /*
  const files = await readdir('./content/reviews');
  return files.filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -'.md'.length))
  */

  const { data } = await fetchReviews({
    fields: ['slug'],
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  })
  return data.map((item: Record<string, any>) => item.attributes.slug);
}

export async function getSearchableReviews() {
  const { data } = await fetchReviews({
    fields: ['slug', 'title'],
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  })
  return data.map(({ attributes }) => ({
    slug: attributes.slug,
    title: attributes.title,
  }));
}

export async function searchReviews(query: string) {
  const { data } = await fetchReviews({
    fields: ['slug', 'title'],
    filters: { title: { $containsi: query } },
    sort: ['title'],
    pagination: { pageSize: 5 },
  })
  return data.map(({ attributes }) => ({
    slug: attributes.slug,
    title: attributes.title,
  }));
}


async function fetchReviews(parameters: Record<string, any>) {
  const url = `${CMS_URL}/api/reviews` + '?' + qs.stringify(parameters, { encodeValuesOnly: true});
  const response = await fetch(url, {
    // cache: 'no-store'
    next: {
      // revalidate: 30, // seconds
      tags: [CACHE_TAG_REVIEWS]
    }
  })
  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} for ${url}`)
  }
  return await response.json();
}

function toReview(item: Record<string, any>) {
  const { attributes } = item;
  return {
    slug: attributes.slug,
    title: attributes.title,
    subtitle: attributes.subtitle,
    date: attributes.publishedAt.slice(0, 'yyy-mm-dd'.length),
    image: new URL(attributes.image.data.attributes.url, CMS_URL).href,
  }
}