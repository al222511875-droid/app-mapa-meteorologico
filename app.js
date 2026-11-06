let map = null;
let marker = null;

document.addEventListener("DOMContentLoaded", () => {
    inicializarMapa(19.2925450, -99.6569007, "Toluca");

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            buscarUbicacion(query);
        }
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
});

function inicializarMapa(lat, lon, nombre) {
    map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(nombre)
        .openPopup();
}

async function buscarUbicacion(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lugar = data[0];
            const lat = parseFloat(lugar.lat);
            const lon = parseFloat(lugar.lon);
            const displayName = lugar.display_name;

            document.getElementById("locationTitle").textContent = query;
            document.getElementById("officialDesc").innerHTML = `<strong>Descripción oficial:</strong> ${displayName}`;
            document.getElementById("latText").textContent = lat.toFixed(6);
            document.getElementById("lonText").textContent = lon.toFixed(6);

            if (map) {
                map.setView([lat, lon], 13);
                marker.setLatLng([lat, lon]).setPopupContent(query).openPopup();
            }
        } else {
            alert("No se encontró la ubicación especificada.");
        }
    } catch (error) {
        console.error("Error al consultar la API:", error);
        alert("Hubo un error al conectar con el servicio.");
    }
}