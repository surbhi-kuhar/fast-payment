import React from "react";

// Loading bar component
export const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <>
      <div
        className={`h-2 w-full bg-blue-500 fixed top-0 left-0 transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"}`}
        style={{
          zIndex: 9999,
        }}
      >
        <div
          className={`absolute top-0 left-0 h-full w-full bg-blue-300 ${loading ? "animate-moving" : ""}`}
        />
      </div>

      <style jsx>{`
        @keyframes move {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-moving {
          animation: move 1.5s infinite linear;
        }
      `}</style>
    </>
  );
};
