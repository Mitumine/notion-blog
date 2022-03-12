import { getDatabase } from "../components/notion";
import { Cards_template } from "../template/page";
export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
    return (
        <main>
            <Cards_template posts={posts} pagename="home" />
        </main>
    );
}

export const getStaticProps = async () => {
    const database = await getDatabase(databaseId);

    return {
        props: {
            posts: database,
        },
        revalidate: 1,
    };
};
