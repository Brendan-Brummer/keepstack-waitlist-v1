<script setup lang="ts">
// SEO and Meta Tags
useHead({
  title: 'KeepStack - Stack memories, keep them forever',
  meta: [
    {
      name: 'description',
      content: "The only photo app that guarantees your family's memories will be accessible in 18 years—even if we're not.",
    },
    {
      property: 'og:title',
      content: 'KeepStack - Stack memories, keep them forever',
    },
    {
      property: 'og:description',
      content: "The only photo app that guarantees your family's memories will be accessible in 18 years—even if we're not.",
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})

// Value propositions data
const valueProps = [
  {
    title: 'Permanent Storage',
    description: 'Your photos backed up across multiple tiers with blockchain timestamps. Delete-proof by design.',
    icon: 'storage',
  },
  {
    title: '3-Second Capture',
    description: 'Voice notes, photos, moments—captured faster than a text. Built for playground speed.',
    icon: 'speed',
  },
  {
    title: 'Always Exportable',
    description: 'One-click download of everything. A promise we literally cannot break, enforced by code.',
    icon: 'export',
  },
]
</script>

<template>
  <div class="min-h-screen bg-obsidian text-white">
    <!-- Main Container -->
    <div class="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <!-- Logo Placeholder -->
      <div class="text-center mb-8 lg:mb-12">
        <div class="inline-flex items-center justify-center px-6 py-3 border-2 border-keepstack-blue/30 rounded-lg text-keepstack-blue font-aeonik font-medium">
          [LOGO PLACEHOLDER]
        </div>
      </div>

      <!-- Hero Section -->
      <section class="text-center mb-16 lg:mb-20 animate-fade-in">
        <h1 class="font-aeonik font-bold text-white mb-4 lg:mb-6" style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1;">
          Stack memories, keep them forever.
        </h1>
        <p class="font-suisse text-indigo text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
          The only photo app that guarantees your family's memories will be accessible in 18 years—even if we're not.
        </p>
      </section>

      <!-- Value Props Section -->
      <section class="mb-16 lg:mb-20">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div
            v-for="(prop, index) in valueProps"
            :key="index"
            class="p-6 lg:p-8 rounded-xl bg-charcoal/30 hover:bg-charcoal/50 transition-all duration-300 border border-charcoal hover:border-keepstack-blue/30 group"
          >
            <!-- Icon Placeholder -->
            <div class="w-12 h-12 mb-4 rounded-lg bg-keepstack-blue/10 flex items-center justify-center group-hover:bg-keepstack-blue/20 transition-colors duration-300">
              <div class="text-keepstack-blue font-aeonik text-sm font-medium">
                [ICON]
              </div>
            </div>

            <h3 class="font-aeonik font-medium text-white text-xl mb-3">
              {{ prop.title }}
            </h3>
            <p class="font-suisse text-indigo leading-relaxed">
              {{ prop.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Waitlist Form Section -->
      <section class="mb-12 lg:mb-16">
        <WaitlistForm />
      </section>

      <!-- Trust Signal -->
      <section class="text-center">
        <p class="font-suisse text-indigo text-sm">
          Built by parents who've lost photos to dead apps
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Additional animations handled by Tailwind config */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
