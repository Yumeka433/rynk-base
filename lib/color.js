import chalk from "chalk"

export const color = (text, color) => {
  return !color
    ? chalk.green(text)
}