import folium
import os

# 1. Crear el mapa base SIN REQUERIR IMÁGENES DE INTERNET (Evita el bloqueo del navegador)
mapa = folium.Map(
    location=[41.5, -4.5], 
    zoom_start=6,
    tiles=None  # Quita el fondo de internet para que no se quede colgado en blanco
)

# Añadir una cuadrícula de coordenadas integrada que funciona sin conexión
folium.LatLngPopup().add_to(mapa)

# 2. Coordenadas de las rutas principales
rutas = {
    "Camino Francés (Rojo)": {
        "coordenadas": [[43.1636, -1.2358], [42.5641, -2.4451], [42.3439, -3.6969], [42.5987, -5.5670], [42.7762, -7.2144], [42.8805, -8.5456]],
        "color": "red"
    },
    "Camino Portugués (Azul)": {
        "coordenadas": [[38.7167, -9.1333], [41.1579, -8.6291], [42.0461, -8.6444], [42.8805, -8.5456]],
        "color": "blue"
    },
    "Camino del Norte (Verde)": {
        "coordenadas": [[43.3390, -1.7894], [43.2630, -2.9350], [43.4623, -3.8099], [43.5357, -5.6615], [42.8805, -8.5456]],
        "color": "green"
    },
    "Camino Primitivo (Naranja)": {
        "coordenadas": [[43.3619, -5.8494], [43.0121, -7.5558], [42.8805, -8.5456]],
        "color": "orange"
    }
}

# 3. Dibujar las líneas de los caminos en el mapa con mayor grosor
for nombre_ruta, datos in rutas.items():
    folium.PolyLine(
        locations=datos["coordenadas"],
        color=datos["color"],
        weight=6,
        tooltip=nombre_ruta
    ).add_to(mapa)

# 4. Marcador de la Catedral de Santiago
folium.Marker(
    location=[42.8805, -8.5456],
    popup="Catedral de Santiago de Compostela",
    icon=folium.Icon(color="purple", icon="info-sign")
).add_to(mapa)

# 5. Guardar el archivo
nombre_salida = "mapa_caminos.html"
mapa.save(nombre_salida)

print(f"¡Mapa local generado!")
print(f"Abre el archivo: {os.path.abspath(nombre_salida)}")
