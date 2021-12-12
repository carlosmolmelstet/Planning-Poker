import breakpoints from "./breakpoints"
import colors from "./colors"
import sizes from "./sizes"
import spacing from "./spacing"
import typography from "./typography"

const foundations = {
  breakpoints,
  colors,
  ...typography,
  sizes,
  space: spacing,
}

export default foundations
