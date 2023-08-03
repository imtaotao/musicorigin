<template>
  <div class="go-up" @click="goUp()">
    <b>TOP</b>
  </div>
</template>

<script>
export default {
  install: function (Vue) {
    Vue.component("go-up", this);
  },

  methods: {
    goUp() {
      this.$event.fire("scrollTop");
    },
  },
};
</script>

<style>
.go-up {
  display: block;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  cursor: pointer;
  z-index: 99999;
  border-radius: 2px;
}
.go-up:hover {
  background: rgba(0, 0, 0, 0.7);
}
.go-up b {
  background: -webkit-gradient(
    linear,
    0 top,
    0 bottom,
    from(#53fdd6),
    to(#0094b9)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 50px;
  font-size: 18px;
  cursor: pointer;
}
</style>
