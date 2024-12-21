<template>
  <h1 class="text-center mt-7">Karte</h1>
  <v-card-subtitle class="text-center mb-3"
    >Verfolge die Spuren deiner Familie auf unserem interaktiven
    Globus!</v-card-subtitle
  >
  <div :is="dynamicComponent" :key="dynamicComponentKey">
    <GMapMap
      :center="center"
      :zoom="3"
      :disableDefaultUI="true"
      style="width: 70vw; height: 900px"
      :options="MapOptions"
      ref="myMapRef"
    >
      <GMapCluster :styles="clusterIcon" :zoomOnClick="true">
        <GMapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="openMarker(m.id)"
          :icon="{
            url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            scaledSize: { width: 40, height: 40 },
            origin: { x: 0, y: 0 },
            anchor: { x: 20, y: 40 },
          }"
          :zoomOnClick="true"
        >
          <!-- Custom marker with person's information -->
          <GMapInfoWindow
            :closeclick="true"
            @closeclick="openMarker(null)"
            :opened="openedMarkerID === m.id"
          >
            <div style="color: black">
              Vorname: {{ m.firstname }} Nachname: {{ m.lastname }}
            </div>
          </GMapInfoWindow>
        </GMapMarker>
      </GMapCluster>
    </GMapMap>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useTheme } from "vuetify/lib/framework";

let backendURL = import.meta.env.VITE_BACKEND_URL;

const theme = useTheme();
const primaryColor = ref(theme.global.current.value.colors.background);
const secundaryColor = ref(theme.global.current.value.colors.secondary);
const textColor = "#ffffff";
const darkmode = ref(theme.global.current.value.name);
const forceUpdate = ref(false);

const openedMarkerID = ref(null);
const center = ref({ lat: 40.689247, lng: -74.044502 });
const persons = ref([]);
const markers = ref([]);
const dynamicComponent = ref("GoogleMapsItem");
const dynamicComponentKey = ref(0);

const myMapRef = ref(null);

const props = defineProps({
  FamilyTreeId: {
    type: Number,
    required: true,
  },
  reloadMap: {
    type: Boolean,
    required: false,
  },
});

watch(
  () => theme.global.name.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // Theme change logic
      if (newValue) {
        console.log("Theme changed to:", newValue);

        reloadMap();
      }
    }
  }
);

const MapOptions = ref({
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: textColor,
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text",
      stylers: [
        {
          color: textColor,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: textColor,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: textColor,
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        {
          color: secundaryColor,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#181818",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1b1b1b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8a8a8a",
        },
      ],
    },
    {
      featureType: "road.arterial",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#4e4e4e",
        },
      ],
    },
    {
      featureType: "road.local",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: primaryColor,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3d3d3d",
        },
      ],
    },
  ],
});

const getPersons = () => {
  axios
    .get(`${backendURL}/persons/familyTree/${props.FamilyTreeId}`)
    .then((response) => {
      persons.value = response.data;
      createMarkers();
    });
};

const createMarkers = () => {
  markers.value = [];
  for (let i = 0; i < persons.value.length; i++) {
    const hometownData = persons.value[i].Hometown;

    if (hometownData && hometownData !== "") {
      try {
        const { lat, lng } = JSON.parse(hometownData);
        const marker = {
          id: persons.value[i].PersonID,
          position: { lat, lng },
          firstname: persons.value[i].Firstname,
          lastname: persons.value[i].Lastname,
        };
        markers.value.push(marker);
      } catch (error) {
        console.error("Error parsing Hometown data:", hometownData);
        console.error("Parsing error details:", error);
      }
    } else {
      console.warn("Empty or invalid Hometown data:", hometownData);
    }
  }
};

onMounted(() => {
  getPersons();
  console.log("mounted");
});

watch(
  () => primaryColor.value,
  (newVal, oldVal) => {
    console.log("darkmode", newVal, oldVal);
    reloadMap();
  }
);

const reloadMap = () => {
  getPersons();
  createMarkers();

  primaryColor.value = theme.global.current.value.colors.background;
  secundaryColor.value = theme.global.current.value.colors.secondary;

  const map = myMapRef.value.$mapObject;
  console.log("map", map);
  //Applying new styles to map
  if (map) {
    console.log(primaryColor.value, "primaryColor", secundaryColor.value);
    const existingStyles = map.get("styles");
    console.log("mapOptions", existingStyles);

    const styles = [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#212121",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: textColor,
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#212121",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text",
        stylers: [
          {
            color: textColor,
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: textColor,
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: textColor,
          },
        ],
      },
      {
        featureType: "administrative.country",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#bdbdbd",
          },
        ],
      },
      {
        featureType: "administrative.neighborhood",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            color: secundaryColor,
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "poi.business",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#181818",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#1b1b1b",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#8a8a8a",
          },
        ],
      },
      {
        featureType: "road.arterial",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
          {
            color: "#4e4e4e",
          },
        ],
      },
      {
        featureType: "road.local",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#616161",
          },
        ],
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#757575",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: primaryColor,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#3d3d3d",
          },
        ],
      },
    ];

    map.set("styles", styles);
    console.log(existingStyles, "existingStyles", styles, "styles");
    google.maps.event.trigger(map, "resize");
  }
};

const openMarker = (id) => {
  openedMarkerID.value = id;
};
</script>
