import Header from "../components/header";
import Footer from "../components/footer";
import { Cards } from "../components/cards";
import { renderBlock } from "../pages/[id]";
import { Tag_color } from "../components/colors";

export const c = "flex flex-col w-5/6 m-auto content-center";

export function Cards_template({ posts, pagename }) {
  return (
    <div className={c}>
      <Header pagename={pagename} />
      <Cards posts={posts} />
      <Footer />
    </div>
  );
}

function make_ul_li(list_blocks) {
  const listclass = "ml-5 p-5";

  var ul_class;
  switch (list_blocks[0].type) {
    case "numbered_list_item":
      ul_class = "list-decimal";
      break;
    case "bulleted_list_item":
      ul_class = "list-disc";
      break;
  }
  return (
    <>
      <ul key={list_blocks.key} className={`${ul_class} ${listclass}`}>
        {list_blocks.map((list_block) => renderBlock(list_block))}
      </ul>
    </>
  );
}

function check_ulli(block, ulli_dict) {
  const TYPE_DECIMAL = "numbered_list_item";
  const TYPE_DISC = "bulleted_list_item";

  if (~block.type.indexOf("list")) {
    if (ulli_dict["decimal"].length > 0) {
      switch (block.type) {
        case TYPE_DISC:
          ulli_dict["code"] = make_ul_li(ulli_dict["decimal"]);
          ulli_dict["disc"].push(block);
          ulli_dict["decimal"] = [];
          break;
        case TYPE_DECIMAL:
          ulli_dict["decimal"].push(block);
          break;
      }
    } else if (ulli_dict["disc"].length > 0) {
      switch (block.type) {
        case TYPE_DISC:
          ulli_dict["disc"].push(block);
          break;

        case TYPE_DECIMAL:
          ulli_dict["code"] = make_ul_li(ulli_dict["disc"]);
          ulli_dict["decimal"].push(block);
          ulli_dict["disc"] = [];
          break;
      }
    } else if (ulli_dict["decimal"].length == 0 || ulli_dict["disc"].length == 0) {
      switch (block.type) {
        case TYPE_DECIMAL:
          ulli_dict["decimal"].push(block);
          break;

        case TYPE_DISC:
          ulli_dict["disc"].push(block);
          break;
      }
    }
  } else {
    if (ulli_dict["decimal"].length > 0) {
      ulli_dict["code"] = make_ul_li(ulli_dict["decimal"]);
      ulli_dict["decimal"] = [];
    } else if (ulli_dict["disc"].length > 0) {
      ulli_dict["code"] = make_ul_li(ulli_dict["disc"]);
      ulli_dict["disc"] = [];
    } else if (ulli_dict["decimal"].length == 0 && ulli_dict["disc"].length == 0) {
      ulli_dict["code"] = renderBlock(block);
    }
  }
  return ulli_dict;
}

export function Pages_template({ blocks, pagename, maintags, subtags }): JSX.Element {
  var ulli_dict = {
    decimal: [],
    disc: [],
    code: "",
  };

  const output_code = (
    <div className={c}>
      <Header pagename={pagename} />
      <h1 className="text-4xl font-bold pb-5">{pagename}</h1>
      {maintags.map((tag) => {
        return (
          <div
            key={tag.key}
            className={`rounded-lg ${Tag_color(
              tag.color
            )} px-2 py-1 text-white font-light inline-block w-auto mr-1 mt-1 text-xs`}
          >
            {tag.name}
          </div>
        );
      })}
      {subtags.map((tag) => {
        return (
          <div
            key={tag.key}
            className={`rounded-lg ${Tag_color(
              tag.color
            )} px-2 py-1 text-white font-light inline-block w-auto mr-1 mt-1 text-xs`}
          >
            {tag.name}
          </div>
        );
      })}
      <section>
        {blocks.map((block) => {
          if (ulli_dict["code"] != "") {
            const render_code = ulli_dict["code"];
            ulli_dict["code"] = "";
            ulli_dict = check_ulli(block, ulli_dict);
            return render_code;
          } else {
            ulli_dict = check_ulli(block, ulli_dict);
          }
        })}
      </section>
      <Footer />
    </div>
  );

  return output_code;
}
