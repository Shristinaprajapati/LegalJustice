import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  const loaderContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  };

  const loaderAnimationStyle = {
    marginTop: "40vh",
    width: "100px", 
    height: "100px",
  };

  return (
    <div style={loaderContainerStyle}>
      <DotLottieReact
        src="https://lottie.host/c8be9641-2c0f-49cb-8e8d-1bd2d0dd242d/V3kwufND4C.lottie"
        loop
        autoplay
        style={loaderAnimationStyle}
      />
    </div>
  );
};

export default Loader;
