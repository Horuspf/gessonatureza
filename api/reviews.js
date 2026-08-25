export default async function handler(req, res) {
  const PLACE_ID = "ChIJcQRZAZaHzpQRO9XKMRJdQlo";
  const API_KEY  = "AIzaSyD9d4btFs0cLwSVkCdOdJ6bU_ytCWLdQcU";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&language=pt-BR&reviews_sort=newest&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      return res.status(500).json({ error: "Sem resultado", details: data });
    }

    // Só 5 estrelas, ordenar pelas mais longas (mais digitadas), top 5 para o carrossel
    const reviews = (data.result.reviews || [])
      .filter(r => r.rating === 5)
      .sort((a, b) => (b.text||"").length - (a.text||"").length)
      .slice(0, 5)
      .map(r => ({
        author_name:       r.author_name,
        profile_photo_url: r.profile_photo_url,
        rating:            r.rating,
        text:              r.text,
        time:              r.time,
      }));

    res.status(200).json({
      rating:  data.result.rating,
      total:   data.result.user_ratings_total,
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
