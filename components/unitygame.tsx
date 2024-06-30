import React, { useState, useEffect, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export function UnityGame() {
  const {
    unityProvider,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "UnityBuild/webgl_app.loader.js",
    dataUrl: "UnityBuild/webgl_app.data",
    frameworkUrl: "UnityBuild/webgl_app.framework.js",
    codeUrl: "UnityBuild/webgl_app.wasm",
  });

  const [direction, setDirection] = useState("");
  const [xpos, setXpos] = useState(0);
  const [ypos, setYpos] = useState(0);

  const handleMove = useCallback((direction: any, xpos: any, ypos: any) => {
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
    <div>
      <button onClick={moveLeft}>Move Left</button>
      {<p>{`Moved! ${direction} x = ${xpos} y = ${ypos} `}</p>}
      <Unity
        unityProvider={unityProvider}
        style={{
          position: "absolute",
          border: "2px solid black",
          background: "grey",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
