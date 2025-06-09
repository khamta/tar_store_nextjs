export const formatPrice = (price: number) => {
  const newPrice = new Intl.NumberFormat("th-TH", {
    // currency: "kip",
    // style: "currency",
  });

  return newPrice.format(price);
};
