export default async function handler(req, res) {
  const PLACE_ID = "ChIJcQRZAZaHzpQRO9XKMRJdQlo";
  const API_KEY  = "AIzaSyD9d4btFs0cLwSVkCdOdJ6bU_ytCWLdQcU";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600"); // cache 1h

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&language=pt-BR&reviews_sort=newest&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      return res.status(500).json({ error: "Sem resultado" });
    }

    // Filtrar 4-5 estrelas, ordenar por nota e pegar as 3 melhores
    const reviews = (data.result.reviews || [])
      .filter(r => r.rating >= 4)
      .sort((a, b) => b.rating - a.rating || b.time - a.time)
      .slice(0, 3);

    res.status(200).json({
      rating: data.result.rating,
      total: data.result.user_ratings_total,
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
