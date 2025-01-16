import React from "react";

const contextFactory = (context, name = "") => {
  return () => {
    const ctx = React.useContext(context);

    if (!ctx) {
      throw new Error(
        `Could not consume ${
          !name ? "this" : `the '${name}'`
        } context since no provider is available`
      );
    }

    return ctx;
  };
};

export default contextFactory;
