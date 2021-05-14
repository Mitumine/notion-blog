import { Fragment } from "react";
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../lib/notion";
import Link from "next/link";
import { databaseId } from "./index.js";
import styles from "./post.module.css";

const Text = ({ value }) => {
  const {
    annotations: { bold, code, color, italic, striketrough, underline },
    text,
  } = value;
  return (
    <span
      className={[
        bold ? styles.bold : "",
        code ? styles.code : "",
        italic ? styles.italic : "",
        striketrough ? styles.striketrough : "",
        underline ? styles.underline : "",
      ].join(" ")}
      style={color !== "default" ? { color } : {}}
    >
      {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
    </span>
  );
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p>
          {value.text.map((value) => (
            <Text value={value} key={value.plain_text} />
          ))}
        </p>
      );
      break;
    case "heading_1":
      return (
        <h1>
          {value.text.map((value) => (
            <Text value={value} key={value.plain_text} />
          ))}
        </h1>
      );
      break;
    case "heading_2":
      return (
        <h2>
          {value.text.map((value) => (
            <Text value={value} key={value.plain_text} />
          ))}
        </h2>
      );
      break;
    case "heading_3":
      return (
        <h3>
          {value.text.map((value) => (
            <Text value={value} key={value.plain_text} />
          ))}
        </h3>
      );
      break;
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <>
          {value.text.map((value) => (
            <li key={value.plain_text}>
              <Text value={value} />
            </li>
          ))}
        </>
      );
      break;
    case "to_do":
      return (
        <div key={id}>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            {value.text.map((value) => (
              <Text value={value} key={value.plain_text} />
            ))}
          </label>
        </div>
      );
      break;
    case "toggle":
      return (
        <details key={id}>
          <summary>
            {value.text.map((value) => (
              <Text value={value} key={value.plain_text} />
            ))}
          </summary>
          It's a toggle!
        </details>
      );
      break;
    case "child_page":
      return <p>{value.title}</p>;
      break;
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }
  const name = page?.properties.Name.title[0]?.plain_text;
  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.name}>{name}</h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          <Link href="/">
            <a className={styles.back}>← Go home</a>
          </Link>
        </section>
      </article>
    </div>
  );
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

  return {
    props: {
      page,
      blocks,
    },
    revalidate: 1,
  };
};