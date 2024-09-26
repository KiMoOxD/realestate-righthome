export let formattedPriceEn = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export let formattedPriceAR = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
});
