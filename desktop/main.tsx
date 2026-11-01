import { createRoot } from "react-dom/client";
import { WireRoot } from "../src/components/wire/WireRoot";
import "../src/styles.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<WireRoot />);
