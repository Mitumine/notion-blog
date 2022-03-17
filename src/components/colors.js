// タグの色を変える
export function Tag_color(color) {
  switch (color) {
    case "light gray":
      return "bg-gray-300";
    case "gray":
      return "bg-gray-500";
    case "brown":
      return "bg-amber-900";
    case "orange":
      return "bg-orange-400";
    case "yellow":
      return "bg-amber-500";
    case "green":
      return "bg-green-400";
    case "blue":
      return "bg-blue-500";
    case "purple":
      return "bg-purple-500";
    case "ping":
      return "bg-ping-500";
    case "red":
      return "bg-red-500";
  }
}
