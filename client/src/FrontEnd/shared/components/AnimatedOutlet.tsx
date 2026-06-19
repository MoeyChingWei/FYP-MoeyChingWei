import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./AnimatedOutlet.module.css";

export default function AnimatedOutlet(): React.ReactElement {
  const location = useLocation();

  // key forces remount so CSS animation runs on route changes
  return (
    <div key={location.pathname} className={styles.wrap}>
      <Outlet />
    </div>
  );
}

