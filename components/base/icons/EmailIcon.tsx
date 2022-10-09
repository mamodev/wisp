import { IconProps } from "../../../types/components/Icon";
import { Colors } from "../../../types/components/Utils";
import { cssUm, getCssColor } from "../../utils";

export function EmailIcon(props: IconProps) {
  const { color = Colors.primary, fontSize = "2em" } = props;

  return (
    <svg
      style={{ fontSize: cssUm(fontSize) }}
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        style={{ fill: getCssColor(color) }}
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-6.54 4.09c-.65.41-1.47.41-2.12 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z"
      />
    </svg>
  );
}
