<template>
  <div class="p-4">
    <div class="py-4">
      This is the Landing Page. Please Login to see Home Page
    </div>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-2"
      @click="navigate()"
    >
      View Home
    </button>
  </div>
</template>

<script setup>
import router from "../router";

const navigate = () => {
  router.push("/home");
};
</script>
