import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro'
import z from "zod";

import { contactSchema } from "@/schema/contact";

const CONTACT_FORMDATA_LIST_KEY = 'contact-form-data';
const url = import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({ url, token });

export const post: APIRoute = async function post({ request }) {
  try {
    const formData: FormData = await request.formData();

    const stringifiedFormData = JSON.stringify(Object.fromEntries(formData));
    const unsanitizedData = JSON.parse(stringifiedFormData) as z.infer<typeof contactSchema>;
    contactSchema.parse(unsanitizedData);
    redis.lpush(CONTACT_FORMDATA_LIST_KEY, stringifiedFormData);

    return Response.json({ success: true })
  } catch {
    return Response.error();
  }
};
