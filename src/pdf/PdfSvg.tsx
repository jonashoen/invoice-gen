"use server";

/* istanbul ignore file */

import React, { ReactElement } from "react";
import htmlParser from "html-react-parser";
import * as PdfElements from "@joshuajaco/react-pdf-renderer-bundled";

interface Props {
  children: React.ReactElement;
  width?: number | string;
  height?: number | string;
  style?: object;
  renderToStaticMarkup: (element: ReactElement) => string;
}

const PdfSvg = ({
  children,
  width,
  height,
  style,
  renderToStaticMarkup,
}: Props) => {
  const svgString = renderToStaticMarkup(children)
    .replace(/px/g, "pt")
    .replace(/<div.*?>/, "")
    .replace("</div>", "");

  let i = 0;

  const component = htmlParser(svgString, {
    replace: (node) => convertToPdfSvg(node, i++),
  });

  return React.cloneElement(component as any, { width, height, style });
};

const convertToPdfSvg = (node: any, index: number) => {
  if (node.type === "text") {
    return node.data;
  }

  node.props = { key: index };

  Object.entries(node.attribs).forEach(([key, value]) => {
    const [first, ...rest] = key.split("-");

    const newKey = [
      first,
      ...rest.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`),
    ].join("");
    node.props[newKey] = value;
  });

  node.name = node.name.toUpperCase();
  if (node.name === "CLIPPATH") node.name = "CLIP_PATH";

  const capitalizedType =
    node.name.charAt(0).toUpperCase() + node.name.slice(1).toLowerCase();

  if (node.children) {
    node.children = node.children.map(convertToPdfSvg);
  }

  if (!(PdfElements as any)[capitalizedType]) {
    return null;
  }

  return React.createElement(
    (PdfElements as any)[capitalizedType],
    node.props,
    node.children
  );
};

export default PdfSvg;
