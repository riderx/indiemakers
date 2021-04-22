<template>
  <client-only>
    <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" />
        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block px-6 pt-5 pb-6 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-indiePurple sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div class="inline-flex justify-center w-full">
            <div class="w-32 h-32 ease-linear border-8 border-t-8 border-white rounded-full loader" />
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>

export default {
  name: 'Loader',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  }
}
</script>
<style>
.loader {
  border-top-color: #df99d8;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
