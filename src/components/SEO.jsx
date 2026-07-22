import { Helmet } from "react-helmet-async";

const SEO = ({
    title,
    description,
    keywords = [],
    canonical,
    robots = "index, follow",
    openGraph = {},
    twitter = {},
    schema,
}) => {
    // console.log(title,
    //     description,
    //     keywords,
    //     canonical,
    //     robots,
    //     openGraph,
    //     twitter,
    //     schema
    // )
    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{title}</title>

            <meta name="description" content={description} />

            <meta
                name="keywords"
                content={Array.isArray(keywords) ? keywords.join(", ") : keywords}
            />

            <meta name="robots" content={robots} />

            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}

            <meta
                property="og:type"
                content={openGraph.type || "website"}
            />

            <meta
                property="og:title"
                content={openGraph.title || title}
            />

            <meta
                property="og:description"
                content={openGraph.description || description}
            />

            <meta
                property="og:url"
                content={canonical}
            />

            <meta
                property="og:image"
                content={openGraph.image}
            />

            {/* Twitter */}

            <meta
                name="twitter:card"
                content={twitter.card || "summary_large_image"}
            />

            <meta
                name="twitter:title"
                content={twitter.title || title}
            />

            <meta
                name="twitter:description"
                content={twitter.description || description}
            />

            <meta
                name="twitter:image"
                content={twitter.image}
            />

            {/* Schema */}

            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;