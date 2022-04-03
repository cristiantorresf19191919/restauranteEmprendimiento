<template>
    <div class="map-container">
        <div id="map" style="height:15rem; margin-bottom:1rem"></div>
        <div id="coordinates" class="coordinates" v-if="coordenatesInfo">
            <span>longitud: {{ coordenatesInfo[0] }}</span> |
            <span>latitud: {{ coordenatesInfo[1] }}</span>
        </div>
        <div class="coordinates" v-if="!coordenatesInfo && location">
            <span>longitud: {{ location[0] }}</span> |
            <span>latitud: {{ location[1] }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useToast } from "primevue/usetoast";
const toast = useToast();
const props = defineProps(['location','name'])
console.log("🚀 ~ file: Map.vue ~ line 21 ~ props", props)

const coordenatesInfo = ref();
const emit = defineEmits(['locationChanged'])
function showToastMsg(detail) {
    toast.add({ severity: 'success', summary: 'Excelent', detail, life: 1000 });
}
onMounted(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWF0bGlmeSIsImEiOiJjbDFpOWJqcm4xc3ZoM2RzOWx0ZGdkcHZ0In0.JQw86zBaDrkWlefj0maVlA';
    coordenatesInfo.value = props.location;
    const map = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        center: !props?.location ? [-74.08083, 4.59889] : props.location,
        zoom: 9
    });
    map.on('load', () => {
        const marker1 = new mapboxgl.Marker(
            { draggable: true }
        )
            .setLngLat(!props?.location ? [-74.08083, 4.59889] : props.location)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<p>${props?.name}</p>`
                    )
            )
            .addTo(map)
            .on('dragend', () => {
                const lngLat = marker1.getLngLat();
                coordenatesInfo.value = [lngLat.lng, lngLat.lat];
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
                coordenatesInfo.value = [lngLat.lng, lngLat.lat];
                showToastMsg('La ubicacion de tu restaurante se ha actualizado con exito')
            })
        );
    });
})

watch(coordenatesInfo, function (newValue, oldValue) {
    emit("locationChanged", newValue)
});

</script>
<style lang="scss">
.map-container {
    position: relative;
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
