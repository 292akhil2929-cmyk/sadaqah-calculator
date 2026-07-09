"use client";

import "./StarBorder.css";

const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "white",
  colorTop,
  colorBottom,
  speed = "6s",
  thickness = 1,
  innerStyle = {},
  children,
  ...rest
}) => {
  const top = colorTop || color;
  const bottom = colorBottom || color;
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${bottom}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${top}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content" style={innerStyle}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
