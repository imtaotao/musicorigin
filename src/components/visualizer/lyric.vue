<template>
  <div class="vis-lyric-container">歌词区域</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(["lyric"]),
  },
};
</script>
