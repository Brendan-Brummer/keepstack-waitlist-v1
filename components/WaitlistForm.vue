<script setup lang="ts">
const { name, email, loading, success, error, submitForm } = useWaitlist()

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  await submitForm()
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Success State -->
    <Transition name="fade">
      <div v-if="success" class="text-center animate-slide-up">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-keepstack-blue/10">
          <svg class="w-8 h-8 text-keepstack-blue animate-scale-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-medium font-aeonik text-white mb-2">
          You're in!
        </h3>
        <p class="text-indigo font-suisse">
          We'll notify you when we launch.
        </p>
      </div>
    </Transition>

    <!-- Form -->
    <Transition name="fade">
      <form v-if="!success" @submit="handleSubmit" class="space-y-4">
        <div class="text-center mb-6">
          <h3 class="text-xl font-medium font-aeonik text-white mb-2">
            Be first to preserve what matters
          </h3>
        </div>

        <!-- Name Input (Optional) -->
        <div>
          <label for="name" class="block text-sm font-medium font-suisse text-indigo mb-2">
            Name <span class="text-indigo/60">(optional)</span>
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            :disabled="loading"
            class="w-full px-4 py-3 bg-charcoal text-white rounded-lg border border-charcoal focus:border-keepstack-blue focus:ring-2 focus:ring-keepstack-blue/50 focus:outline-none transition-all duration-200 font-suisse disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder="Your name"
          />
        </div>

        <!-- Email Input (Required) -->
        <div>
          <label for="email" class="block text-sm font-medium font-suisse text-indigo mb-2">
            Email <span class="text-red-400">*</span>
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="loading"
            class="w-full px-4 py-3 bg-charcoal text-white rounded-lg border border-charcoal focus:border-keepstack-blue focus:ring-2 focus:ring-keepstack-blue/50 focus:outline-none transition-all duration-200 font-suisse disabled:opacity-60 disabled:cursor-not-allowed"
            :class="{ 'border-red-500': error }"
            placeholder="you@example.com"
          />
        </div>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="error" class="text-red-400 text-sm font-suisse">
            {{ error }}
          </div>
        </Transition>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-3 bg-keepstack-blue text-white font-medium font-suisse rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span v-if="!loading">Join Waitlist</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>

          <!-- Hover gradient effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-volt-blue via-volt-cyan to-volt-blue bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-gradient-shift transition-opacity duration-300 -z-10"></div>
        </button>

        <!-- Privacy Note -->
        <p class="text-xs text-indigo text-center font-suisse">
          We'll only email about KeepStack. No spam, ever.
        </p>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
