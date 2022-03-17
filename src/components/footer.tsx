import Moment from "react-moment";
import { Sitename } from "./names";
import React from "react";

export default function Footer() {
  const today_date = new Date();

  return (
    <footer>
      <div className="h-30 w-full py-10 ">
        <h1 className="text-m text-center">
          {Sitename} ©<Moment format="YYYY">{today_date}</Moment>
        </h1>
      </div>
    </footer>
  );
}
