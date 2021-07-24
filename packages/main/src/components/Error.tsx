import Head from 'next/head';

interface ErrorPageProps {
  code: number;
  message: string;
  title: string;
}

export default function ErrorPage({ code, message, title }: ErrorPageProps) {
  return (
    <div
      className="bg-discord-dark flex flex-col items-center justify-center text-center text-black"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <Head>
        <title>{title} | Pepe Emoji</title>
      </Head>

      <div>
        <h1 className="border-white border-solid border-r inline-block text-2xl my-0 ml-0 mr-5 py-2 pl-0 pr-6 text-white align-top font-bold">
          {code}
        </h1>

        <div className="inline-block h-12 text-left align-middle" style={{ lineHeight: '49px' }}>
          <h2 className="text-sm m-0 p-0 text-white" style={{ fontWeight: 'normal', lineHeight: 'inherit' }}>
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
}
