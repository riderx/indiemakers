<template>
  <div class="w-1/2 p-10 bg-white">
    <button class="mb-5 text-3xl text-royalblue-700 lg:mb-10 font-indie">
      {{ all.total }} € Revenues
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
        Revenue {{ incomesTotal }} € 💰
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
import Vue, { PropOptions } from 'vue'
import { Income, IncomeAll } from '~/services/discord/bot/incomes'
export default Vue.extend({
  name: 'ListTasks',
  props: {
    all: {
      type: Object,
      default: () => {},
    } as PropOptions<IncomeAll>,
  },
  data() {
    return {
      incomes: [] as Income[],
      incomesTotal: 0,
      expenses: [] as Income[],
      expensesTotal: 0,
      status: 'income',
    }
  },
  computed: {
    filtered(): Income[] {
      return this.status === 'income' ? this.incomes : this.expenses
    },
  },
  mounted() {
    // this.projectId = this.user.projectsData[0].hashtag
    this.incomes = this.all.incomes.filter((a: Income) => a.status === 'income')
    this.expenses = this.all.incomes.filter(
      (a: Income) => a.status === 'expense'
    )
    this.expensesTotal = this.expenses.reduce((tt, v) => tt + v.ammount, 0)
    this.incomesTotal = this.incomes.reduce((tt, v) => tt + v.ammount, 0)
  },
})
</script>
