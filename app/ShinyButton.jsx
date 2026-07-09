"use client";

import "./ShinyButton.css";

// Simple CSS-only shiny sweep — no motion dependency. A light band sweeps
// across the button on a loop; color/background stay whatever you pass in.
const ShinyButton = ({ as: Component = "button", className = "", style = {}, children, ...rest }) => {
  return (
    <Component className={`shiny-button ${className}`} style={style} {...rest}>
      <span className="shiny-button-sweep" />
      <span className="shiny-button-content">{children}</span>
    </Component>
  );
};

export default ShinyButton;
