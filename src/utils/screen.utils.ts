import defaultScreen from "../assets/device/default.json";
export function setShellStyle(shell: any, device?: string) {
  shell.style.position = "relative";
  shell.style.margin = "auto";
  // shell.style.border = "#6E7C89 .5px solid";
  // shell.style.width = ck65.width;
  shell.style.height =
    process.env.VUE_APP_IS_ANDROID_SIMULATOR === "true"
      ? defaultScreen.height + 40 + "px"
      : defaultScreen.height + "px";
  shell.style.width = defaultScreen.width + "px";
  // shell.style.height = defaultScreen.height;
}
