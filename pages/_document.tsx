import React from "react";
import Document, {
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

export default class MyDocument extends Document<DocumentProps> {
  public render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
