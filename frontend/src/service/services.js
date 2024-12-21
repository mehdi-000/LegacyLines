// This exports the ApiServices object, making it available for import in other parts of the application

import { client } from "./axiosClient";

// Object containing various API services for interacting with the family tree backend
const ApiServices = {

  // For searching family trees based on a keyword and optional user ID
  searchFamilyTree: (keyword, userId)  => {
    let path = `/familyTree/search/${keyword}`;

    if (userId) {
      path += `?userId=${userId}`;
    }

    return client.get(path);
  },

  // For searching all family trees with an optional user ID filter
  searchAllFamilyTree: (userId)  => {
    let path = `/familyTree/searchAll`;

    if (userId) {
      path += `?userId=${userId}`;
    }

    return client.get(path);
  },

  // For retrieving a family tree by its ID
  getFamilyTreeById: (id) => {
    return client.get(`/familyTree/getById/${id}`);
  },

  // For creating a new family tree
  createFamilyTree(data) {
    return client.post(`/familyTree`, {
      "name" : data.name,
      "userID" : data.userID,
      "description" : data.description,
      "ispublic" : data.ispublic
    });
  },

  // For requesting to join a family tree
  requestJoinTree(data) {
    return client.post(`/accessControl/requestJoin`, {
      "familyTreeId": data.familyTreeId,
      "userId": data.userId
    });
  },

  // For retrieving a list of join requests for a user
  searchRequestList: (data) => {
    return client.get(`/accessControl/getListRequest/${data.userId}?page=${data.page}&itemsPerPage=${data.itemsPerPage}`, );
  },

  // For accepting a join request
  acceptRequest: (data) => {
    return client.put(`/accessControl/accept/${data.AccessID}`, );
  },

  // For rejecting a join request
  rejectRequest: (data) => {
    return client.delete(`/accessControl/reject/${data.AccessID}`, );
  },
};

export default ApiServices;