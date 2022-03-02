import 'regenerator-runtime/runtime';

import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { RelayEnvironmentProvider } from 'react-relay';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import initialEnvironment from '../relay/initialEnvironment';
import { appleIcons, keywords } from '../utils/constants';

interface Props {
  records: RecordMap;
}

export default class MyDocument extends Document<Props> {
  public static override async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & Props> {
    const originalRenderPage = ctx.renderPage;
    const relayServerSSR = new RelayServerSSR();
    const env = initialEnvironment(relayServerSSR);

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceComponent: (Component) => (props) =>
          (
            <RelayEnvironmentProvider environment={env}>
              <Component {...props} />
            </RelayEnvironmentProvider>
          ),
      });

    await Document.getInitialProps(ctx);
    await relayServerSSR.getCache();
    const records = env.getStore().getSource().toJSON();

    ctx.renderPage = () =>
      originalRenderPage({
        // @ts-expect-error
        // eslint-disable-next-line react/display-name
        enhanceApp: (App) => (props) => <App {...props} records={records} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, records };
  }

  public override render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
          <meta name="theme-color" content="#00a81a" />

          <meta name="keywords" content={keywords.join(', ')} />

          <meta name="title" content="Pepe Manager" />
          <meta property="og:title" content="Pepe Manager" />
          <meta
            name="description"
            content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
          />
          <meta
            property="og:description"
            content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
          />
          <meta property="og:type" content="website" />

          <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {appleIcons.map(({ href, media }, i) => (
            <link key={i} rel="apple-touch-icon" href={href} media={media} />
          ))}
        </Head>
        <body>
          <template id="relay-data">{Buffer.from(JSON.stringify(this.props.records)).toString('base64')}</template>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
