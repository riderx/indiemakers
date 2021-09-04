<template>
  <div>
    <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">
      {{ total }} € revenus
    </button>
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
    <article
      v-for="income in filtered"
      :key="income.id"
      class="py-5 border-b-2 lg:mx-10 border-orchid-300"
    >
      <h1 class="text-xl">{{ income.ammount }} €</h1>
      <time class="text-sm text-royalblue-700" :datetime="income.date">{{
        income.date
      }}</time>
    </article>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from '@nuxtjs/composition-api'
import { Income, IncomeAll } from '~/services/types'

export default defineComponent({
  props: {
    all: { type: Object as () => IncomeAll, default: () => {} },
  },
  setup({ all }) {
    const status = ref('income')
    const incomes = computed(() =>
      all.incomes.filter((a: Income) => a.status === 'income')
    )
    const expenses = computed(() =>
      all.incomes.filter((a: Income) => a.status === 'expense')
    )
    const incomesTotal = computed(() =>
      incomes.value.reduce((tt: number, v: Income) => tt + v.ammount, 0)
    )
    const expensesTotal = computed(() =>
      expenses.value.reduce((tt: number, v: Income) => tt + v.ammount, 0)
    )
    const filtered = computed(() =>
      status.value === 'income' ? incomes.value : expenses.value
    )
    return { filtered, status, incomesTotal, expensesTotal, total: all.total }
  },
})
</script>
