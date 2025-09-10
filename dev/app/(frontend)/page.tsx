import configPromise from "@payload-config";
import { notFound } from "next/navigation.js";
import { getPayload } from "payload";
import RichText from "./RichText.js";

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "posts",
    limit: 1,
  });

  if (result.docs.length === 0) {
    return notFound();
  }

  const post = result.docs[0];

  const { content } = post;

  return (
    <div>
      <h2>Testing code block</h2>
      {content && <RichText data={content} />}
    </div>
  );
}
