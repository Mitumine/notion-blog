import Header from "../components/header";
import Footer from "../components/footer";
import { Cards } from "../components/cards";
import { renderBlock } from "../pages/[id]";

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

export function Pages_template({ blocks, pagename }): JSX.Element {
    var disc_list = [];
    var decimal_list = [];

    const TYPE_DECIMAL = "numbered_list_item";
    const TYPE_DISC = "bulleted_list_item";

    var output_code = (
        <div className={c}>
            <Header pagename={pagename} />
            <h1 className="text-4xl font-bold pb-5">{pagename}</h1>
            <section>
                {blocks.map((block) => {
                    if (~block.type.indexOf("list")) {
                        if (decimal_list.length > 0) {
                            switch (block.type) {
                                case TYPE_DISC:
                                    output_code = make_ul_li(decimal_list);
                                    disc_list.push(block);
                                    decimal_list = [];
                                    return output_code;
                                case TYPE_DECIMAL:
                                    decimal_list.push(block);
                                    break;
                            }
                        } else if (disc_list.length > 0) {
                            switch (block.type) {
                                case TYPE_DISC:
                                    disc_list.push(block);
                                    break;
                                case TYPE_DECIMAL:
                                    output_code = make_ul_li(disc_list);
                                    decimal_list.push(block);
                                    disc_list = [];
                                    return output_code;
                            }
                        } else if (
                            decimal_list.length == 0 ||
                            disc_list.length == 0
                        ) {
                            switch (block.type) {
                                case TYPE_DECIMAL:
                                    decimal_list.push(block);
                                    break;

                                case TYPE_DISC:
                                    disc_list.push(block);
                                    break;
                            }
                        }
                    } else {
                        if (decimal_list.length > 0) {
                            output_code = make_ul_li(decimal_list);
                            decimal_list = [];
                            return output_code;
                        } else if (disc_list.length > 0) {
                            output_code = make_ul_li(disc_list);
                            disc_list = [];
                            return output_code;
                        } else if (
                            decimal_list.length == 0 &&
                            disc_list.length == 0
                        ) {
                            return renderBlock(block);
                        }
                    }
                })}
            </section>
            <Footer />
        </div>
    );

    return output_code;
}
