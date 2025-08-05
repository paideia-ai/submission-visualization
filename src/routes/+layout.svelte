<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <h1 class="text-xl font-semibold text-gray-900">Problem-Solving Session Visualization</h1>
      </div>
    </div>
  </header>
  
  <main>
    <slot />
  </main>
</div>