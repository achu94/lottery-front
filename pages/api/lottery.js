export default async function (req, res) {
  const url = "https://whattomine.com/coins/151.json";

  const ethPrice = await getEthPrice(req);
  console.log(ethPrice);

  try {
    let eth_profit = await fetch(url, {})
      .then((res) => res.json())
      .then((result) => {
        result.eth_price = ethPrice;
        return result;
      });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "max-age=180000");
    res.end(JSON.stringify(eth_profit));
  } catch (error) {
    res.json(error);
    res.status(405).end();
  }
}
