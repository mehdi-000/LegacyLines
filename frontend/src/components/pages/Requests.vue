<!--@author Thi Ha Trang Dinh - Join Request-->
<!--  This page is for viewing a list of requests to join in familytree of users-->
<!--  User can accept or decline a join request from other users-->

<template>
    <v-data-table-server
      :headers="headers"
      v-model:items-per-page="itemsPerPage"
      :items-length="totalItems"
      :items="serverItems"
      :loading="loading"
      item-value="name"
      @update:options="loadItems"
  >
      <thead>
      <tr>
        <th v-for="col in headers" :key="col.text">
          <b>{{ col.text }}</b>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="col in serverItems" :key="col.AccessID">
        <td>
          {{ col.treeName }}
        </td>
        <td>
          {{ col.treeDesc }}
        </td>
        <td>
          {{ col.reqUserName }}
        </td>
        <td>
          {{ col.reqUserEmail }}
        </td>
        <td>
            <button class="action-button accept" @click="acceptRequest(col.AccessID)">Annehmen</button>
            <button class="action-button reject" @click="rejectRequest(col.AccessID)">Ablehnen </button>
        </td>
      </tr>
      </tbody>

  </v-data-table-server>
</template>

<script setup>
import { ref, watch } from 'vue'
import ApiServices from "@/service/services";
import {authenStore} from "@/store/authen.store";

// Reactive variables
const itemsPerPage = ref(5)
const headers = ref([
  { text: 'Tree Name', value: 'treeName' },
  { text: 'Tree Desc', value: 'treeDesc' },
  { text: 'Requested User', value: 'reqUserName' },
  { text: 'Requested User Email', value: 'reqUserEmail' },
  { text: 'Actions', value: '' },
  // Add more headers as needed
])

const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

// Load items
function loadItems ({ page, itemsPerPage }) {
  console.log("page", page);
  console.log("itemsPerPage",itemsPerPage)
  loading.value = true
  const data = {
    userId: authenStore.user?.id,
    page: page,
    itemsPerPage: itemsPerPage
  }
  ApiServices.searchRequestList(data).then((res) => {
    serverItems.value = res.data
    totalItems.value = res.data.length
    loading.value = false
  })
}

// Accept a request
function acceptRequest (AccessID) {
  loading.value = true
  const data = {
    AccessID: AccessID
  }
  ApiServices.acceptRequest(data).then((res) => {
    if(res.status === 200) {
      loadItems({page:1,itemsPerPage:5})
    }
  })
}
// Reject a request
function rejectRequest (AccessID) {
  loading.value = true
  const data = {
    AccessID: AccessID
  }
  ApiServices.rejectRequest(data).then((res) => {
    if(res.status === 200) {
      loadItems({page:1,itemsPerPage:5})
    }
  })
}
</script>

<style scoped>
.action-button {
  border: 2px black solid;
  margin: 5px;
  padding: 5px;
  border-radius: 8px;
}
.action-button.accept {
  background: rgba(114, 239, 97, 0.7);
}
.action-button.reject {
  background: rgba(234, 57, 57, 0.7);
}
.action-button.accept:hover {
  background: rgba(114, 239, 97, 1);
}
.action-button.reject:hover {
  background: rgba(234, 57, 57, 1);
}
</style>