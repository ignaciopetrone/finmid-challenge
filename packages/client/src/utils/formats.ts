export const formatPrice = (
  amount: string,
  currency: string,
  country: string
) => {
  // Convert the amount to a number
  const amountNumber = parseFloat(amount);

  // Use Intl.NumberFormat to format the price based on the locale and currency
  const formatter = new Intl.NumberFormat(country, {
    style: 'currency',
    currency: currency,
  });

  // Format the price and return it
  return formatter.format(amountNumber);
};

export const formatDate = (timeString: string) =>
  new Date(timeString).toDateString();
