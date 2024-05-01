mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const el = document.createElement("div");

el.style.backgroundImage =
  "url(https://www.shutterstock.com/image-vector/home-icon-flat-symbol-isolated-260nw-1034563708.jpg)";
el.style.width = `30px`;
el.style.height = `30px`;
el.style.borderRadius = "50%";
el.style.backgroundSize = "100%";

const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}, ${listing.country}</h4><p>Exact Location Will Be Provided After Booking</p>`
    )
  )
  .addTo(map);
