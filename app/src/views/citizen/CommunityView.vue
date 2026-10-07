<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Community</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Neighbors and cleanup events</h1>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div class="space-y-5">
        <article v-for="post in posts" :key="post.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">{{ post.author }}</h2>
              <p class="text-xs text-slate-500">{{ post.time }}</p>
            </div>
            <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{{ post.category }}</span>
          </div>
          <p class="mt-4 text-sm leading-6 text-slate-700">{{ post.text }}</p>
          <div class="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span>👍 {{ post.likes }}</span>
            <span>💬 {{ post.comments }}</span>
            <span>📍 {{ post.location }}</span>
          </div>
        </article>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Upcoming events</h2>
        <ul class="mt-4 space-y-3 text-sm text-slate-700">
          <li v-for="event in events" :key="event.id" class="rounded-xl bg-slate-50 p-3">
            <p class="font-semibold text-slate-900">{{ event.name }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ event.date }} · {{ event.location }}</p>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const posts = ref([
  {
    id: 1,
    author: 'Asha M.',
    time: '2 hours ago',
    category: 'Cleanup',
    text: 'Community cleanup this Saturday from 8:00am to noon. Please bring gloves and reusable bags.',
    likes: 18,
    comments: 5,
    location: 'Kibera',
  },
  {
    id: 2,
    author: 'Samuel N.',
    time: 'Yesterday',
    category: 'Awareness',
    text: 'We are mapping blocked drains around the main market. Report any flood-prone areas immediately.',
    likes: 24,
    comments: 3,
    location: 'Mombasa Road',
  },
]);

const events = ref([
  { id: 1, name: 'Riverbank cleanup', date: 'Sat, 9:00 AM', location: 'Kisumu' },
  { id: 2, name: 'School waste drive', date: 'Mon, 1:30 PM', location: 'Nairobi' },
]);
</script>
