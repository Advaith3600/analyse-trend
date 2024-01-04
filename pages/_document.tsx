import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="title" content="AnalyseTrend - AI-Powered Trend Analysis" />
        <meta name="description" content="AnalyseTrend is your hub for AI-driven project insights. Let our advanced AI models guide your project decisions and turn your ideas into successful ventures." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://analysetrend.com/" />
        <meta property="og:title" content="AnalyseTrend - AI-Powered Trend Analysis" />
        <meta property="og:description" content="AnalyseTrend is your hub for AI-driven project insights. Let our advanced AI models guide your project decisions and turn your ideas into successful ventures." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://analysetrend.com/" />
        <meta property="twitter:title" content="AnalyseTrend - AI-Powered Trend Analysis" />
        <meta property="twitter:description" content="AnalyseTrend is your hub for AI-driven project insights. Let our advanced AI models guide your project decisions and turn your ideas into successful ventures." />

        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
