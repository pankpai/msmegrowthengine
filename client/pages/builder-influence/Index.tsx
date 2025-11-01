import { useAuth } from "@/hooks/use-auth";
import React, { useEffect, useRef } from "react";

const InfluencerServiceFrame: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const userToken = localStorage.getItem("refreshtoken");
  const user = JSON.parse(localStorage.getItem("user")||"{}")
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && userToken) {
      iframe.onload = () => {
        const target = iframe.contentWindow;
        target?.postMessage(
          {
            type: "INIT_DATA",
            payload: {
              token: userToken,
              user,
            },
          },
          "http://localhost:8081",
        );
      };
    }
  }, [userToken]);

  return (
    <div style={{ height: "100vh" }}>
      <iframe
        ref={iframeRef}
        src="http://localhost:8081"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Influencer Builder"
      />
    </div>
  );
};

export default InfluencerServiceFrame;
