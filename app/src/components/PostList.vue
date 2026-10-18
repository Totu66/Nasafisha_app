<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id">
      <SinglePost :post="post" />
    </div>
  </div>
</template>

<script setup>
import SinglePost from "./SinglePost.vue";

defineProps(["posts"]);
</script>

<style lang="scss" scoped></style>
