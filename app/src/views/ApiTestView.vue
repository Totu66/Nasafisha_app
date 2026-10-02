<template>
  <div class="p-4">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded me-2"
      @click="loadData()"
    >
      Test-API
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "../store";

/**VARIABLES */
const usersStore = useUsersStore();

// onMounted(() => {
//   loadData();
// });

/**Function to load data from API */
const loadData = async () => {
  await usersStore.getAll();
};
</script>
