let descripciones;

d3.json("data/descripciones.json").then(function(data) {
    descripciones = data;
    mapa();
}).catch(function(error) {
    console.error("Error loading province data:", error);
});


function actualizarMapa(){
    var background = document.getElementById('mapa');
    const width = document.getElementById('mapa').offsetWidth;
    const height = document.getElementById('mapa').offsetHeight;

    d3.select("#mapa svg").remove();
    const svg = d3.select("#mapa")
        .append("svg")
        .attr("class", "mapaSVG")
        .attr("id", "mapaSVG")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .scale(1000)
        .center([-3.7, 40])
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.append("g").attr("class", "centroids");

    d3.select("#info").style("display", "block");

    d3.json("spainMap.geojson").then(function(geoData) {
        const regions = g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
                d3.select(this).attr("fill", "orange");
                d3.select("#info").text(d.properties.name);
            })
            .on("mouseout", function () {
                d3.select(this).attr("fill", "lightblue");
                d3.select("#info").text("Selecciona una provincia");
            })
            .on("click", function(event, d) {
                const nombreProvincia = d.properties.name;
                actualizarMapaDescripcion(nombreProvincia)
            });
        }).catch(error => console.error("Error al cargar el GeoJSON:", error));
}

function actualizarMapaDescripcion(nombreProvincia) {

    const data = descripciones[nombreProvincia];
    if (data) {
        d3.select("#imagenProvincia").attr("src", `/${data.image}`);
        d3.select("#description").text(data.description);
    } else {
        console.error("No data found for province:", nombreProvincia);
        d3.select("#imagenProvincia").attr("src", "imagenes/blanco.png");
        d3.select("#description").text("Descripción no disponible.");
    }
}

function actualizarWeb() {

  $("#mapaSVG").css("zoom", window.innerWidth / 1800);

}

$(document).ready(function() {

  $(window).on("resize", actualizarMapa);
  actualizarMapa();

});

