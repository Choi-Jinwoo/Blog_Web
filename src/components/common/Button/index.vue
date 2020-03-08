<template>
  <button
    :style="buttonStyle"
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
  >{{ text }}</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

type Size = "medium" | "large";
type Color = "blue" | "white" | "transparent";
type colorMapType = {
  [color: string]: {
    color: string;
    background: string;
    hoverBackground: string;
  };
};

const colorMap: colorMapType = {
  blue: {
    background: "#597DFF",
    hoverBackground: "#A6B9FF",
    color: "#FFFFFF"
  },
  white: {
    background: "#FFFFFF",
    hoverBackground: "#F0F0F0",
    color: "#597DFF"
  },
  transparent: {
    background: "#none",
    hoverBackground: "#F0F0F0",
    color: "#597DFF"
  }
};

@Component
export default class Button extends Vue {
  isMouseOver: boolean = false;

  @Prop({ type: String })
  text?: string | null;

  @Prop({ type: String, default: "medium" })
  size!: Size;

  @Prop({ type: String, default: "blue" })
  color!: Color;

  get buttonStyle() {
    return {
      color: colorMap[this.color].color,
      "background-color": !this.isMouseOver
        ? colorMap[this.color].background
        : colorMap[this.color].hoverBackground,
      "font-size": this.size === "medium" ? "1rem" : "1.25rem",
      padding: this.size === "medium" ? "0.5rem" : "0.5rem"
    };
  }
}
</script>

<style lang="scss" scoped>
button {
  margin: 0;
  text-align: center;
  font-weight: bold;
  outline: none;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: black;
}
</style>