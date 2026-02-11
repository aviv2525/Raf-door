export default function Head() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "דלתות פנים - מכירה התקנה ושיפוץ",
    areaServed: "מרכז הארץ",
    description: "מכירה, התקנה ושיפוץ דלתות פנים במרכז הארץ. עבודה מקצועית, נקייה ואחריות מלאה.",
    url: "https://example.com", // לשים את הדומיין כשתעלה לאוויר
    telephone: "+972-50-000-0000", // לשנות למספר אמיתי
  };

  return (
    <>
      <title>דלתות פנים במרכז | מכירה, התקנה ושיפוץ</title>
      <meta
        name="description"
        content="דלתות פנים במרכז הארץ: מכירה, התקנה ושיפוץ. עבודה נקייה, דיוק ואחריות מלאה. צרו קשר להצעת מחיר."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <script
        type="application/ld+json"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
