import Head from "next/head"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { useEffect, VFC } from "react"

export const cache = createCache({ key: "css", prepend: true })

const MyApp: VFC<any> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>YouTube Plus</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href={"/favicon.ico"} />
      </Head>

      <Component {...pageProps} />
    </CacheProvider>
  )
}

// noinspection JSUnusedGlobalSymbols
export default MyApp
