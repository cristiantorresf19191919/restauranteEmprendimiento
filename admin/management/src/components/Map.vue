<template>
    <div class="map-container">
        <div id="map"></div>
        <div id="coordinates" class="coordinates" v-if="coordenatesInfo">
            <span>longitud: {{ coordenatesInfo.longitude }}</span> |
            <span>latitud: {{ coordenatesInfo.latitude }}</span>
        </div>
        <div class="coordinates" v-if="!coordenatesInfo && location">
            <span>longitud: {{ location[0] }}</span> |
            <span>latitud: {{ location[1] }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onUpdated, inject } from 'vue';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useToast } from "primevue/usetoast";


const toast = useToast();
const props = defineProps(['location', 'name','IsFormEditing'])
const locationInjected = inject('location')

const location = ref(props.location)
const coordenatesInfo = ref();
coordenatesInfo.value = props.location;

const emit = defineEmits(['locationChanged'])
function showToastMsg(detail) {
    toast.add({ severity: 'success', summary: 'Excelent', detail, life: 1000 });
}

function loadMap() {
    console.log("🚀 ~ file: Map.vue ~ line 23 ~ props", props)
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWF0bGlmeSIsImEiOiJjbDFpOWJqcm4xc3ZoM2RzOWx0ZGdkcHZ0In0.JQw86zBaDrkWlefj0maVlA';
    console.log("🚀 ~ file: Map.vue ~ line 33 ~ onMounted ~ props.location", props.location)
    const mapSettings = {
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 5
    }
    if (props.location) {
        const {longitude, latitude} = props.location;
        mapSettings.center = [longitude,latitude];
        mapSettings.zoom = 12;
    }
    const map = new mapboxgl.Map(mapSettings);
    const markerLocation = props.location ? [props.location.longitude,props.location.latitude] : [-74.564564, 20.654564];
    map.on('load', () => {
        const marker1 = new mapboxgl.Marker(
            { draggable: true }
        )
            .setLngLat(markerLocation)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<p>${props?.name}</p>`
                    )
            )
            .addTo(map)
            .on('dragend', () => {
                const lngLat = marker1.getLngLat();                
                coordenatesInfo.value = {longitude: lngLat.lng, latitude:lngLat.lat};
                emit("locationChanged", coordenatesInfo.value)
                showToastMsg('La ubicacion de tu restaurante se ha actualizado con exito')
            });
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                zoom: 15,
                placeholder: 'Busca tu sitio',
                mapboxgl: mapboxgl,
                countries: 'co',
                reverseGeocode: true,
                language: 'es'
            }).on('result', (event) => {
                const [lon, lat] = event?.result?.center;               
                coordenatesInfo.value = {longitude: lon, latitude:lat};
                emit("locationChanged", coordenatesInfo.value)           
                showToastMsg('La ubicacion de tu restaurante se ha actualizado con exito')
            })
        );
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                showUserLocation: true,
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,                
            }).on('geolocate', (coordenates) => {            
                const {latitude, longitude } = coordenates?.coords;               
                coordenatesInfo.value = {longitude, latitude};
                     marker1.setLngLat([longitude, latitude])
                emit("locationChanged", coordenatesInfo.value)
                showToastMsg('La ubicacion de tu restaurante se ha actualizado con exito')
            })
        )
    });
}


onMounted(() => {    
    console.log("🚀 ~ file: Map.vue ~ line 112 ~ onMounted ~ locationInjected", locationInjected)
    loadMap()
})

onUpdated(() => {
    if (!props?.location) return
    // eliminar renders infinitos    
    console.log("🚀 ~ file: Map.vue ~ line 111 ~ onUpdated ~ props.IsFormEditing", props.IsFormEditing)
    if(props.IsFormEditing >= 75) return
    loadMap()
})


</script>
<style lang="scss">
.map-container {
    position: relative;
    flex-basis: 39rem;
    #map {
        height: 100%;
    }
}
.coordinates {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    position: absolute;
    bottom: 29px;
    left: 10px;
    padding: 5px 10px;
    display: flex;
    gap: 0.8rem;
    margin: 0;
    font-size: 11px;
    line-height: 18px;
    border-radius: 3px;
}
.mapboxgl-popup {
    width: 5rem;
}

.mapboxgl-popup-content {
    text-align: center;
    font-family: "Open Sans", sans-serif;
}
</style>
