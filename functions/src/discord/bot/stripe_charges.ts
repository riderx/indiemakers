import Stripe from "stripe";
import dayjs, {Dayjs} from "dayjs";

// create restricted key here:https://dashboard.stripe.com/apikeys
// with only charges read scope
interface charge {
  stripeId: string,
  date: string,
  status: string,
  ammount: number
}

const secondsToISOString = (seconds: number) => {
  const date = new Date(seconds * 1000);
  return date.toISOString();
};

const convertAmmount = (ammount: number) => {
  return ammount/100;
};

const iterateCharges = (apiRes: Stripe.ApiList<Stripe.Charge>, startDate: Dayjs, endDate: Dayjs) => {
  const allCharges: charge[] = [];
  apiRes.data.forEach((charge: Stripe.Charge) => {
    const curDate = dayjs(secondsToISOString(charge.created));
    const ammount = convertAmmount(charge.amount_captured - charge.amount_refunded);
    const status = ammount > 0 ? "income" : "expense";
    if (dayjs(curDate).isAfter(startDate) && dayjs(curDate).isBefore(endDate)) {
      allCharges.push({stripeId: charge.id, date: curDate.toISOString(), status, ammount});
    }
  });
  return allCharges;
};

export const getStripeCharges = async (key:string, startDate=dayjs("2010-01-01"), endDate=dayjs()) => {
  const stripe = new Stripe(key, {
    apiVersion: "2020-08-27",
  });
  let hasMore = true;
  let startingAfter = null;
  let startingAfterDate = dayjs();
  const allCharges = [];
  while (hasMore && dayjs(startDate).isBefore(startingAfterDate)) {
    const query: any = {
      limit: 10,
    };
    if (startingAfter) {
      query.starting_after = startingAfter;
    }
    const charges = await stripe.charges.list(query);
    allCharges.push(iterateCharges(charges, startDate, endDate));
    hasMore = charges.has_more;
    startingAfter = charges.data[charges.data.length-1].id;
    startingAfterDate = dayjs(secondsToISOString(charges.data[charges.data.length-1].created));
  }
  return allCharges;
};
// const stripeKey = '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'
// const getByDate = async (startDate, endDate) => {
//   const charges = await get_all(stripeKey, startDate, endDate);
//   charges.forEach(charge => {
//     console.log(charge);
//   });
// }

// getByDate('2021-01-01T00:00:00.000Z', '2021-03-31T00:00:00.000Z');


