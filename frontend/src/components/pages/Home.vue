<script>
import ApiServices from "../../service/services";
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import { checkAutho } from "../../service/checkAutho";
import { authenStore } from "@/store/authen.store";
import addPersons from "@/components/addPersons.vue";
import relationships from "@/components/Relationships.vue";

export default {
  computed: {
    authenStore() {
      return authenStore;
    },
    currentTitle() {
      // Switch statement to determine the title based on the current step
      switch (this.step) {
        case 1:
          return "Create Family Tree";
        case 2:
          return "Add People";
        case 3:
          return "Add Relationships";
        default:
          return "Congratulations! Your family tree has been created";
      }
    },
  },
  // Component registration
  components: {
    DisplayFamilyTree,
    addPersons,
    relationships,
  },
  data: () => ({
    // General state and control
    reveal: false,
    reveal1: false,
    reveal2: false,
    user: null,
    loading: false,
    shouldReloadFamilyTree: false,
    familyTreeId: null,
    creatingFamilyTreeFailed: false,

    // Control
    isOpenCreateDialog: false,
    isOpenDetailDialog: false,
    isOpenRequestDialog: false,
    isOpenErrorDialog: false,
    errorMessage: "",
    familyTreeId: "",
    step: 1,

    // Search
    keyword: "",
    familyTrees: [],
    detailSelected: {},

    // Add
    name: "",
    nameRules: [(v) => !!v || "Name is required"],
    desc: "",
    descRules: [(v) => !!v || "Description is required"],
    ispublic: false,
  }),
  async mounted() {
    // Check authorization on component mount
    try {
      const { loading, user } = await checkAutho();
      this.loading = loading;
      this.user = user;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    // Handle the reload of the family tree
    handleReloadFamilyTree(value) {
      this.shouldReloadFamilyTree = !this.shouldReloadFamilyTree;
      console.log(this.shouldReloadFamilyTree);
    },
    getMaxWidth() {
      if (this.step === 3) {
        return "65%"; // Max width for the last step
      } else {
        return "50%"; // Max width for the first two steps
      }
    },
    openCreateDialog() {
      this.isOpenCreateDialog = true;
    },
    openDetailDialog() {
      this.isOpenDetailDialog = true;
    },
    openRequestDialog(FamilyTreeID) {
      this.familyTreeId = FamilyTreeID;
      this.isOpenRequestDialog = true;
    },
    closeErrorDialog() {
      this.errorMessage = "";
      this.isOpenErrorDialog = false;
    },
    closeDialog() {
      this.isOpenCreateDialog = false;
      this.isOpenDetailDialog = false;
      this.isOpenRequestDialog = false;
    },
    openErrorDialog(mess) {
      this.errorMessage = mess;
      this.isOpenErrorDialog = true;
    },
    // Search for family trees based on the provided keyword
    searchFamilyTree() {
      if (this.keyword) {
        ApiServices.searchFamilyTree(this.keyword, authenStore.user?.id)
          .then((res) => {
            if (!res.data) return;
            this.familyTrees = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.familyTrees = [];
          })
          .finally(() => {});
      } else {
        ApiServices.searchAllFamilyTree(authenStore.user?.id)
          .then((res) => {
            if (!res.data) return;
            this.familyTrees = res.data;
          })
          .catch((err) => {
            console.log(err);
            this.familyTrees = [];
          })
          .finally(() => {});
      }
    },
    // Create a new family tree
    async createFamilyTree() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        ApiServices.createFamilyTree({
          name: this.name,
          userID: authenStore.user?.id,
          description: this.desc,
          ispublic: this.ispublic,
        })
          .then((res) => {
            console.log(res, "res");
            this.familyTreeId = res.data.FamilyTreeID;
            this.step++;
          })
          .catch((err) => {
            console.log(err);
            this.creatingFamilyTreeFailed = true;
            if (err.response.status == "401") {
              // TO DO : Show noti or something
            }
          });
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Form is valid");
    },
    // Find details of a unique family tree based on the provided FamilyTreeID
    findUniqueTree(FamilyTreeID) {
      console.log("FamilyTreeID", FamilyTreeID);
      ApiServices.getFamilyTreeById(FamilyTreeID)
        .then((res) => {
          if (!res.data) return;
          this.detailSelected = res.data;
          console.log("detailSelected", this.detailSelected);
          this.openDetailDialog();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // Request to join a family tree
    requestJoinTree() {
      ApiServices.requestJoinTree({
        familyTreeId: this.familyTreeId,
        userId: authenStore.user?.id,
      })
        .then((res) => {
          console.log("resssss", res);
        })
        .catch((err) => {
          console.log(err);
          this.openErrorDialog(err.response.data.message);
        })
        .finally(() => {
          this.closeDialog();
        });
    },
    // Check if the join button should be displayed for the specified tree
    shouldDisplayJoinButton(tree) {
      const userId = this.authenStore.user?.id;
      return (
        userId &&
        userId + "_" + tree.FamilyTreeID !== tree.AccessControl?.AccessID &&
        userId !== tree.OwnerUserID
      );
    },
  },
};
</script>
<!-- Text mittig setzen-Zeile 27: class="d-flex align-center text-center bg-shades-white"  -->
<template>
  <div>
    <!-- Loading spinner when data is being fetched -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      ::size="75"
      :width="8"
    ></v-progress-circular>

    <!-- Search and display section for family trees -->
    <v-row no-gutters>
      <v-col cols="12" class="search-tree-wrapper">
        <v-container>
          <div
            class="search-tree-content"
            style="height: calc(100vh - 64px - 48px)"
          >
            <!-- 16px is padding of v-container -->
            <h1>Discover your family tree now!</h1>
            <h2>Search for a specific family tree</h2>
            <div class="search-box">
              <v-text-field
                color="third"
                variant="underlined"
                placeholder="Search Family Tree"
                v-model="keyword"
                rounded
              />
              <v-btn class="mt-2" variant="outlined" @click="searchFamilyTree"
                >Search
              </v-btn>
            </div>

            <!-- Results section for family trees -->
            <div class="search-tree-results">
              <!-- Create family tree button -->
              <div class="search-tree-item create" @click="openCreateDialog">
                <img src="/images/create-icon.png" alt="create" />
              </div>

              <!-- Display individual family trees -->
              <v-card
                variant="outlined"
                v-for="tree in familyTrees"
                :key="tree.FamilyTreeID"
                class="search-tree-item"
              >
                <h4>Family Tree Name: {{ tree.Name }}</h4>
                <div class="buttons-wrap">
                  <!-- Join button -->
                  <v-btn
                    v-if="shouldDisplayJoinButton(tree)"
                    @click="openRequestDialog(tree.FamilyTreeID)"
                  >
                    Join
                  </v-btn>
                  <!-- View button -->
                  <v-btn @click="findUniqueTree(tree.FamilyTreeID)">
                    View
                  </v-btn>
                </div>
              </v-card>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <!-- Create family tree dialog -->
    <v-dialog
      v-model="isOpenCreateDialog"
      :style="{ 'max-width': getMaxWidth() }"
    >
      <v-card>
        <v-card-title
          class="text-h6 font-weight-regular text-center mx-auto justify-space-between mb-3 mt-3"
        >
          <span>{{ currentTitle }}</span>
          <v-avatar
            v-if="step < 3"
            color="primary"
            size="24"
            v-text="step"
          ></v-avatar>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-window v-model="step">
          <!-- Step 1: Create family tree -->
          <v-window-item :value="1">
            <v-card>
              <div v-if="authenStore.loggedIn">
                <v-sheet width="300" class="mx-auto">
                  <v-form ref="form">
                    <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      label="Name"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="desc"
                      :rules="descRules"
                      label="Description"
                      required
                    ></v-text-field>

                    <v-checkbox v-model="ispublic" label="Public"></v-checkbox>
                  </v-form>
                </v-sheet>
                <v-row v-if="loginFailed" class="mt-2">
                  <v-col>
                    <v-alert type="error">
                      Family tree creation failed.
                    </v-alert>
                  </v-col>
                </v-row>
              </div>

              <div v-else>
                <v-sheet width="300" class="mx-auto">
                  You must be logged in to create a family tree
                </v-sheet>
              </div>

              <v-card-actions style="display: flex; justify-content: end">
                <v-btn @click="closeDialog">Close</v-btn>
                <v-btn variant="elevated" @click="createFamilyTree"
                  >Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>

          <!-- Step 2: Add persons to the family tree -->
          <v-window-item :value="2">
            <addPersons
              :FamilyTreeId="this.familyTreeId"
              :ReloadFamilyTree="this.shouldReloadFamilyTree"
            />
          </v-window-item>

          <!-- Step 3: Add relationships to the family tree -->
          <v-window-item :value="3">
            <relationships :FamilyTreeId="this.familyTreeId" edit="false" />
          </v-window-item>

          <!-- Step 4: Success message and redirection button -->
          <v-window-item :value="4">
            <v-card>
              <v-alert type="success">
                Go to your family tree to see the results
              </v-alert>
              <v-card-text>
                <v-btn @click="this.$router.push('/chooseFamilyTree')"
                  >To Family Tree
                </v-btn>
              </v-card-text>
              <v-card-actions style="display: flex; justify-content: end">
                <v-btn @click="closeDialog">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>
        </v-window>

        <v-card-actions v-if="step > 1 && step < 4">
          <v-btn v-if="step > 1" variant="text" @click="step--"> Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="step > 1 && step < 4" variant="flat" @click="step++">
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View family tree details dialog -->
    <v-dialog v-model="isOpenDetailDialog" max-width="100%" max-height="80vh">
      <v-card height="80vh">
        <v-card-title> Family Tree : {{ detailSelected.Name }}</v-card-title>

        <v-card-item>
          <v-row no-gutters>
            <v-col cols="6" class="description">
              Description : {{ detailSelected.Describtion }}
              <relationships
                :FamilyTreeId="detailSelected.FamilyTreeID"
                v-if="authenStore.loggedIn"
                @reload-family-tree="handleReloadFamilyTree"
              />
            </v-col>
            <v-col
              cols="6"
              :class="{
                'show-nodes': authenStore.loggedIn,
                'hide-nodes': !authenStore.loggedIn,
              }"
            >
              <!-- Overlay message for non-logged-in users -->
              <div class="hide-nodes-overlay" style="">
                You must be logged in to view the family tree
              </div>
              <!-- Display family tree nodes for logged-in users -->
              <div style="height: 100vh">
                <DisplayFamilyTree
                  :FamilyTreeId="detailSelected.FamilyTreeID"
                  DisplaySize="60vh"
                  :ReloadFamilyTree="this.shouldReloadFamilyTree"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-item>
        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Request to join family tree dialog -->
    <v-dialog v-model="isOpenRequestDialog" max-width="50%">
      <v-card>
        <v-card-title class="mx-auto" color=""> Join Family Tree</v-card-title>

        <!-- Join request content for logged-in users -->
        <div v-if="authenStore.loggedIn">
          <v-sheet width="300" class="mx-auto">
            <p>Would you like to join this family tree?</p>
          </v-sheet>
        </div>

        <!-- Message for non-logged-in users -->
        <div v-else>
          <v-sheet width="300" class="mx-auto">
            You must be logged in to send a join request to the family tree
          </v-sheet>
        </div>

        <v-card-actions style="display: flex; justify-content: end">
          <div v-if="authenStore.loggedIn">
            <v-btn @click="closeDialog">No</v-btn>
            <v-btn variant="elevated" @click="requestJoinTree">Yes</v-btn>
          </div>
          <div v-else>
            <v-btn @click="closeDialog">Close</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isOpenErrorDialog" max-width="50%">
      <v-card>
        <v-card-title> Error</v-card-title>

        <v-sheet width="300" class="mx-auto">
          <p>{{ this.errorMessage }}</p>
        </v-sheet>

        <v-card-actions style="display: flex; justify-content: end">
          <v-btn @click="closeErrorDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- Information and hints section for creating a family tree -->
  <h1 class="pa-md-15 mx-lg-auto text-center">
    Tips for creating a family tree
  </h1>

  <!-- Container for displaying hints in a row -->
  <v-container class="mb-5">
    <v-row justify="center" align="center">
      <!-- Step 1 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Tip for you</div>
              <div class="text-h4 mb-4">Step 1</div>
              <div class="text-caption">
                To create a family tree, first click the plus symbol. Then enter
                the information. After that, click "Create" and then "Next".
              </div>
            </div>
          </v-card-item>

          <v-expand-transition>
            <div v-show="reveal">
              <v-card-text class="pb-5">
                <p>- You must be logged in to create a family tree.</p>
              </v-card-text>
            </div>
          </v-expand-transition>

          <v-card-actions>
            <v-btn variant="text" @click="reveal = !reveal">
              {{ reveal ? "Close" : "Read more" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Step 2 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Tip for you</div>
              <div class="text-h4 mb-4">Step 2</div>
              <div class="text-caption">
                When adding persons, please enter the information, click
                "Create". When all persons are finished, click "Next".
              </div>
            </div>
          </v-card-item>

          <v-expand-transition>
            <div v-show="reveal1">
              <v-card-text class="pb-5">
                <p>- Almost done</p>
              </v-card-text>
            </div>
          </v-expand-transition>
          <v-card-actions>
            <v-btn variant="text" @click="reveal1 = !reveal1">
              {{ reveal1 ? "Close" : "Read more" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Step 3 -->
      <v-col>
        <v-card class="mx-auto rounded-xl" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Tip for you</div>
              <div class="text-h4 mb-4">Step 3</div>
              <div class="text-caption">
                To create relationships, select the person with
                child-relationship. Then click on the parent and select "Father"
                or "Mother". After that, click "Add to list".
              </div>
            </div>
          </v-card-item>

          <v-expand-transition>
            <div v-show="reveal2">
              <v-card-text class="pb-5">
                <p>- Call up your profile or family tree information!</p>
                <p>- You must be logged in to save relationships!</p>
              </v-card-text>
            </div>
          </v-expand-transition>
          <v-card-actions>
            <v-btn variant="text" @click="reveal2 = !reveal2">
              {{ reveal2 ? "Close" : "Read more" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<style scoped>
.search-tree-wrapper {
  /* background-image: url(/images/Bild1.jpg); */
  /* background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
  ),
  url(https://images.pexels.com/photos/3875160/pexels-photo-3875160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
  */
  background-size: cover;
  background-position: center;
  position: relative;
}

.search-tree-content {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  padding: 10px;
}

.search-box {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.search-tree-results {
  height: 100%;
  display: flex;
  gap: 20px;
  margin: 40px 0px 20px 0;
  flex-wrap: wrap;
  justify-content: start;
  overflow: auto;
}

/* Target the entire scrollbar */
::-webkit-scrollbar {
  width: 6px; /* Set the width of the scrollbar */
}

.search-tree-item {
  width: 200px;
  height: 180px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 0;
}

.search-tree-item .buttons-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.search-tree-item.create {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='grey' stroke-width='4' stroke-dasharray='14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

.search-tree-item.create img {
  margin: auto;
  width: 50%;
  height: auto;
}

.search-tree-item button {
  width: 50%;
  padding: 5px 20px;
  border-radius: 30px;
}

.description {
  text-align: left;
}

.show-nodes {
  max-width: 50%;
  overflow: auto;
  height: 64vh;
}

.show-nodes .hide-nodes-overlay {
  display: none;
}

.hide-nodes {
  max-height: 65vh;
  position: relative;
}

.hide-nodes .hide-nodes-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  z-index: 999;
  text-align: center;
  padding: 30%;
}

@media (max-width: 960px) {
  .search-tree-wrapper {
    margin-top: 16px;
  }
}
</style>
