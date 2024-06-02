import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { Unity, useUnityContext } from "react-unity-webgl";
import React, { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "UnityBuild/webgl_app.loader.js",
    dataUrl: "UnityBuild/webgl_app.data",
    frameworkUrl: "UnityBuild/webgl_app.framework.js",
    codeUrl: "UnityBuild/webgl_app.wasm",
  });

  const [direction, setDirection] = useState("");
  const [xpos, setXpos] = useState(0);
  const [ypos, setYpos] = useState(0);

  const handleMove = useCallback((direction:any ,xpos:any, ypos:any) => {
    setDirection(direction);
    setXpos(xpos);
    setYpos(ypos);
  }, []);

  useEffect(() => {
    addEventListener("MoveCallback", handleMove);
    return () => {
      removeEventListener("MoveCallback", handleMove);
    };
  }, [addEventListener, removeEventListener, handleMove]);

  function moveLeft() {
    sendMessage("Sphere", "MoveLeft", 10);
  }

  return (
    <WagmiProvider config={config}>
      <Unity unityProvider = {unityProvider} 
      style={{
        height: "100%",
        width: 1000,
        border: "2px solid black",
        background: "grey",
      }}/>
      <button onClick={moveLeft}>Move Left</button>
      {<p>{`Moved! ${direction} x = ${xpos} y = ${ypos} `}</p>}
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
