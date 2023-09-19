"use client";

import { useEffect, useState } from "react";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowLoader(true), 250);
  }, []);

  return (
    showLoader && (
      <div className="flex justify-center mt-20 animate-bounce">
        <p className="text-3xl">lädt...</p>
      </div>
    )
  );
};

export default Loader;
