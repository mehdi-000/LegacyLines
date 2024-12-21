<!-- @author Mehdi Popal
This component isdefining the behavior of a family tree visualization. 
The family tree is displayed using the Vue Flow library -->

<script setup>
import { h, ref } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import axios from "axios";
import { useTheme } from "vuetify/lib/framework";
import { onMounted, defineProps, watch } from "vue";

let backendURL = import.meta.env.VITE_BACKEND_URL;

//Define the props of the component to be able to define the family tree id, the display size and the reload family tree
const props = defineProps(["FamilyTreeId", "DisplaySize", "ReloadFamilyTree"]);

const { toObject, fitView, onNodeClick } = useVueFlow();

const sqlData = ref("");
const displaySize = ref(props.DisplaySize);
const nodes = ref([]);

const theme = useTheme();
const edges = ref([]);
const loading = ref(true);
const flowKey = ref("test");

const position = ref();

const familyTreeAccess = ref("");
const user = ref([]);

const nodePositionString = ref();
const DisplaySize = displaySize.value.split("vh")[0];

let flow;

const showAdditionalInfoDialog = ref(false);
const selectedNode = ref(null);
let errors = false; // Error state
const Owner = ref(""); // Owner of the family tree
// Fetch user information, access control, and family tree data on component mount
onMounted(async () => {
  try {
    // Get user information
    const userResponse = await axios.get(
      `${backendURL}/users/yes/authenticate`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    // Get access control based on user id and family tree id to determine if the user has edit access
    const accessControlResponse = await axios.get(
      `${backendURL}/accessControl/${props.FamilyTreeId}/${userResponse.data.user.id}`
    );
    // Get family tree data
    familyTreeAccess.value = accessControlResponse.data;
    const FamilytreeResponse = await axios.get(
      `${backendURL}/familyTree/getById/${props.FamilyTreeId}`
    );
    flowKey.value = FamilytreeResponse.data.Name;
  } catch (error) {
    console.error(error);
    loading.value = false;
    errors = true;
    throw error;
  }
  loading.value = false;
  Owneruser();
  displayFamilyTree();
});
// Fetch and set the owner of the family tree
const Owneruser = async () => {
  try {
    const OwneruserResponse = await axios.get(
      `${backendURL}/familyTree/getOwner/${props.FamilyTreeId}`
    );
    Owner.value = OwneruserResponse.data.Username;
  } catch (error) {
    console.error(error);
    errors = true;
    throw error;
  }
};
// Display family tree nodes and relationships on the canvas
const displayFamilyTree = async () => {
  // fetch relationships and persons data
  const relationshipsResponse = await axios.get(
    `${backendURL}/relationsships/familyTree/${props.FamilyTreeId}`
  );
  const relationships1 = relationshipsResponse.data;
  try {
    axios
      .get(`${backendURL}/persons/familyTree/${props.FamilyTreeId}`)
      .then((response) => {
        const startY = 100; // Adjust the starting Y position
        const spacingY = 100; // Adjust the spacing between rows
        // Map generations to persons
        const generations = new Map();
        const generationHeights = {
          "The Greatest Generation": 0,
          "The Silent Generation": 1,
          "The Baby Boomer Generation": 2,
          "Generation X": 3,
          Millennials: 4,
          "Generation Z": 5,
          "Gen Alpha": 6,
        };
        // calculate positions and create nodes
        // Use a dynamic variable to track the current X position for each generation
        const startXByGeneration = {};

        response.data.forEach((person, index) => {
          const birthYear = new Date(person.BirthDate).getFullYear();
          let generation;
          if (birthYear >= 1901 && birthYear <= 1927) {
            generation = "The Greatest Generation";
          } else if (birthYear >= 1928 && birthYear <= 1945) {
            generation = "The Silent Generation";
          } else if (birthYear >= 1946 && birthYear <= 1964) {
            generation = "The Baby Boomer Generation";
          } else if (birthYear >= 1965 && birthYear <= 1980) {
            generation = "Generation X";
          } else if (birthYear >= 1981 && birthYear <= 1996) {
            generation = "Millennials";
          } else if (birthYear >= 1996 && birthYear <= 2012) {
            generation = "Generation Z";
          } else {
            generation = "Gen Alpha";
          }

          // Set Y position for each generation
          const newY = startY + generationHeights[generation] * spacingY;

          // Set X position for each person within the same generation
          const startX =
            startXByGeneration[generation] ||
            (startXByGeneration[generation] = 250);
          // Set the node color based on the relationship type
          let nodeColor = theme.global.current._value.colors.primary; // Default color
          const personRelationships = relationships1.filter(
            (relationship) =>
              relationship.PersonOneID === person.PersonID ||
              relationship.PersonTwoID === person.PersonID
          );

          if (personRelationships.length > 0) {
            const relationshipType = personRelationships[0].Relationship_type;
            nodeColor =
              relationshipType === "Mutter"
                ? theme.global.current._value.colors.secondary
                : theme.global.current._value.colors.third;
          }
          if (
            flow === undefined ||
            !flow.nodes.find((node) => node.id === person.PersonID.toString())
          ) {
            nodes.value.push({
              id: person.PersonID.toString(),
              label: person.Firstname,
              position: { x: startX, y: newY },
              style: { backgroundColor: nodeColor },
            });
          }
          // Update the X position for the next person in the same generation
          startXByGeneration[generation] += 170;

          // Store the generation for later use
          generations.set(person.PersonID, generation);
        });
        generations.forEach((generation, personID) => {}); // Map of PersonID and generation

        axios
          .get(`${backendURL}/relationsships/familyTree/${props.FamilyTreeId}`)
          .then((response) => {
            // Map relationships to nodes and edges
            response.data.forEach((relationship) => {
              const sourcePerson = nodes.value.find(
                (node) => node.id === relationship.PersonOneID?.toString()
              );
              const targetPerson = nodes.value.find(
                (node) => node.id === relationship.PersonTwoID?.toString()
              );
              // Set the edge color based on the relationship type
              if (sourcePerson && targetPerson) {
                const edgeColor =
                  relationship.Relationship_type === "Mutter"
                    ? theme.global.current._value.colors.secondary
                    : theme.global.current._value.colors.third;
                // push the edge to the edges array
                edges.value.push({
                  id: `e${relationship.RelationshipID}`,
                  source: targetPerson.id,
                  target: sourcePerson.id,
                  style: { stroke: edgeColor, strokeWidth: 2 },
                  /*          label: relationship.Relationship_type,
                  labelStyle: { fill: edgeColor, fontWeight: 700 },
                  labelBgStyle: { fill: "#aaa" }, */
                });
              }
            });
          });
      });
    loading.value = false;
  } catch (error) {
    errors = true;
    loading.value = false;
    console.error(error, "error");
    throw error;
  }
};

// Save the current node positions
// #notimplemented due to the lack of time the current version causes performance issues
const onSave = () => {
  loading.value = true;
  const nodePosition = JSON.stringify(toObject());

  axios
    .post(`${backendURL}/familyTree/nodes/${props.FamilyTreeId}`, {
      NodePosition: nodePosition,
    })
    .then((response) => {
      loading.value = false;
    })
    .catch((error) => {
      console.error("Error saving node positions:", error);
    });
};

// Restore the node positions
// #notimplemented due to the lack of time the current version causes performance issues
const onRestore = () => {
  axios
    .get(`${backendURL}/familyTree/nodes/${props.FamilyTreeId}`)
    .then((response) => {
      // Handle the response as needed
      if (!response.data.NodePosition.nodes) {
        displayFamilyTree();
      } else {
        nodePositionString.value = response.data.NodePosition;

        try {
          flow = JSON.parse(nodePositionString.value);
          position.value = flow;
          nodes.value = flow.nodes;
          edges.value = flow.edges;
        } catch (error) {
          console.error("Error parsing NodePosition:", error);
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching node positions:", error);
    });
};

// Watch for changes in ReloadFamilyTree prop to reload the family tree
watch(
  () => props.ReloadFamilyTree,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      displayFamilyTree();
    }
  }
);

// Watch for changes to the current theme
watch(
  () => theme.global.name.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // Theme change logic
      if (newValue) {
        displayFamilyTree();
      }
    }
  }
);

// Set the view to fit the canvas
const fitViewOnPaneReady = () => {
  setTimeout(() => {
    fitView();
  }, 300);
};

// Handle node click and display additional information
onNodeClick((node) => {
  selectedNode.value = node;
  axios
    .get(`${backendURL}/persons/${node.node.id}`)
    .then((response) => {
      selectedNode.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
  showAdditionalInfoDialog.value = true;
});
const formatBirthdate = (birthdate) => {
  const dateObject = new Date(birthdate);
  const formattedBirthdate = dateObject.toLocaleDateString("de-DE");
  return formattedBirthdate;
};
</script>

<template>
  <div class="d-flex">
    <v-card-subtitle class="mr-auto text-left"
      >Name: {{ flowKey }}</v-card-subtitle
    >
    <v-card-subtitle class="ml-auto text-right">
      Ersteller: {{ Owner }}
    </v-card-subtitle>
  </div>
  <!--  Loading animation -->
  <v-skeleton-loader
    :loading="loading"
    :elevation="1"
    type="card"
    class="vue-flow-wrapper"
  >
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="vue-flow-basic-example"
      :default-zoom="0.2"
      :min-zoom="0.2"
      :max-zoom="4"
      @pane-ready="fitViewOnPaneReady"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap v-if="DisplaySize > 70" />
      <Controls />
    </VueFlow>
    <!--    showing the controls only if the user has edit access kinda useless since we don't have the save and restore functionality implemented 
    <div
      v-if="familyTreeAccess === 'edit' && DisplaySize > 70"
      class="controls"
    ></div>
    -->
    <v-dialog v-model="showAdditionalInfoDialog" max-width="600">
      <v-card>
        <v-card-title>Zusätzliche Informationen</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-row>
                  <v-col>
                    <v-list-item-title>Vorname:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedNode.Firstname
                    }}</v-list-item-subtitle>
                  </v-col>
                  <v-col>
                    <v-list-item-title>Nachname:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      selectedNode.Lastname
                    }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-list-item-title>Geburtsdatum:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      formatBirthdate(selectedNode.BirthDate)
                    }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showAdditionalInfoDialog = false">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="errors" type="error">
      Fehler beim Laden der Daten. Kein Bearbeitungszugriff vorhanden. Tritt dem
      Stammbaum bei oder versuche es erneut.
    </v-alert>
  </v-skeleton-loader>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

.flowname {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
}

.vue-flow-wrapper {
  position: relative;
  height: v-bind("displaySize");
  width: relative;
}

.saveFlow {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.restoreFlow {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 100;
}
</style>
