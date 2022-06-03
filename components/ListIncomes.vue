<template>
  <div>
    <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">{{ total }} € revenus</button>
    <div class="flex mb-5 border-b-2 lg:mb-10 border-royalblue-700">
      <button
        class="mr-3 text-2xl text-royalblue-700 focus:outline-none"
        :class="{
          'border-b-2 border-royalblue-700 px-2': status === 'income',
          'opacity-50': status === 'expense',
        }"
        @click="status = 'income'"
      >
        revenu {{ incomesTotal }} € 💰
      </button>
      <button
        class="mr-3 text-2xl text-royalblue-700 focus:outline-none"
        :class="{
          'border-b-2 border-royalblue-700 px-2': status === 'expense',
          'opacity-50': status === 'income',
        }"
        @click="status = 'expense'"
      >
        Dépense {{ expensesTotal }} € 💸
      </button>
    </div>
    <article v-for="income in filtered" :key="income.id" class="py-5 border-b-2 lg:mx-10 border-orchid-300">
      <p class="text-xl text-black">{{ income.ammount }} €</p>
      <time class="text-sm text-royalblue-700" :datetime="income.date">{{ income.date }}</time>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { Income, IncomeAll } from '~/services/types'

  const { all } = defineProps({
    all: { type: Object as () => IncomeAll, default: () => {} },
  })
  const total = all.total
  const status = ref('income')
  const incomes = computed(() => all.incomes.filter((a: Income) => a.status === 'income'))
  const expenses = computed(() => all.incomes.filter((a: Income) => a.status === 'expense'))
  const incomesTotal = computed(() => incomes.value.reduce((tt: number, v: Income) => tt + v.ammount, 0))
  const expensesTotal = computed(() => expenses.value.reduce((tt: number, v: Income) => tt + v.ammount, 0))
  const filtered = computed(() => (status.value === 'income' ? incomes.value : expenses.value))

</script>
