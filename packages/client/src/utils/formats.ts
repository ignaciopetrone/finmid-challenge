export const formatPrice = (
  amount: string,
  currency: string,
  country: string
) => {
  const amountNumber = parseFloat(amount);

  const formatter = new Intl.NumberFormat(country, {
    style: 'currency',
    currency: currency,
  });

  return formatter.format(amountNumber);
};

export const formatDate = (timeString: string): string => {
  const date = new Date(timeString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};
