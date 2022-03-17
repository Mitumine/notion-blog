import Card from "./card";
import React from "react";

export const Cards = ({ posts }) => {
  return (
    <div className="flex flex-wrap pb-5">
      {posts.map((post) => (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-3">
          <Card {...post} key={post.key} />
        </div>
      ))}
    </div>
  );
};
