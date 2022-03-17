import { Fragment } from "react";
import { getDatabase, getPage, getBlocks } from "../components/notion";
import Link from "next/link";
import { databaseId } from "./index";
import { Pages_template } from "../template/page";
import { Bookmark } from "../components/bookmark";
import { Code } from "../components/codeblock";
import React from "react";

export const Text = ({ text }) => {
  if (!text || text == "") {
    return null;
  }

  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;

    return (
      <span
        className={[
          bold ? "font-bold" : "",
          code ? "font-mono bg-slate-100 px-2 py-1 rounded-m" : "",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : "",
          "whitespace-pre-wrap",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

export function renderBlock(block) {
  if (block == null) {
    return "";
  }

  const { type, id } = block;
  const value = block[type];

  if (value.rich_text) {
    var text = value.rich_text;
  } else if (!value.rich_text) {
    var text = null;
  }

  const text_margin = "mt-6 mb-2";

  switch (type) {
    case "paragraph":
      if (!text || text == "") {
        return null;
      } else {
        return (
          <p className="my-4" key={id}>
            <Text text={text} />
          </p>
        );
      }
    case "heading_1":
      return (
        <h1 className={`${text_margin} text-4xl font-bold`} key={id}>
          <Text text={text} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 className={`${text_margin} text-3xl font-bold`} key={id}>
          <Text text={text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className={`${text_margin} text-2xl font-bold`} key={id}>
          <Text text={text} />
        </h3>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li key={id} className="mb-2">
          <Text text={text} />
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} /> <Text text={text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src = value.type === "external" ? value.external.url : value.file.url;
      var caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return <blockquote key={id}>{text[0].plain_text}</blockquote>;
    case "code":
      return <Code block={block} />;
    case "file":
      const src_file = value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className="">
            📎{" "}
            <Link href={src_file} passHref>
              {lastElementInArray.split("?")[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case "bookmark":
    case "link_preview":
      var caption, url, linktype;
      switch (type) {
        case "bookmark":
          linktype = block.bookmark;
          break;
        case "link_preview":
          linktype = block.link_preview;
          break;
      }
      url = linktype.url;
      caption = linktype.caption ? linktype.caption : [];
      caption = caption.length != 0 ? caption[0].plain_text : "";
      return <Bookmark url={url} key={id} caption={caption} />;

    default:
      return `❌ Unsupported block (${type === "unsupported" ? "unsupported by Notion API" : type})`;
  }
}

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <></>;
  }

  if (page.properties.Name) {
    var NameOrTitle = page.properties.Name;
  } else {
    var NameOrTitle = page.properties.title;
  }

  const maintags = page.properties.Tags.multi_select;
  const subtags = page.properties.subtag.multi_select;

  const pagename = NameOrTitle.title[0].plain_text;
  const view = <Pages_template blocks={blocks} pagename={pagename} maintags={maintags} subtags={subtags} />;

  return view;
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find((x) => x.id === block.id)?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  };
};
