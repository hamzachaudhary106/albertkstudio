import { buildLocalSchemas } from "../data/seo";

export default function LocalSeo() {
  const schemas = buildLocalSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
