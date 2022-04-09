<template>
    <div class="map-container">
        <div id="map" style="height:15rem; width: 50vw;"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useToast } from "primevue/usetoast";

const props = defineProps(['coordenates'])

onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWF0bGlmeSIsImEiOiJjbDFpOWJqcm4xc3ZoM2RzOWx0ZGdkcHZ0In0.JQw86zBaDrkWlefj0maVlA';
    if (!props.coordenates) return
    const {longitude, latitude} = props.coordenates;
    const map = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude,latitude],
        zoom: 14
    });
    map.on('load', () => { 
        const marker1 = new mapboxgl.Marker(
            { draggable: true }
        )
            .setLngLat([longitude,latitude])
            .addTo(map)
            .on('dragend', () => {
            });
    });
})
</script>
<style lang="scss">
.map-container {
    position: relative;
}
</style>
