import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner"; // Make sure to install this package

const LoadingAnimation = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false); // After 3 seconds, hide the loading animation
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      {/* Show the loading animation while the state is true */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Circles color="#90BE6D" height={80} width={80} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default LoadingAnimation;
