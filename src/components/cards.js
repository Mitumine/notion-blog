import Card from "./card";

export const Cards = ({ posts }) => {
    return (
        <div key={posts.key} className="flex flex-wrap pb-5">
            {posts.map((post) => (
                <div
                    key={post.key}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-3"
                >
                    <Card {...post} />
                </div>
            ))}
        </div>
    );
};
