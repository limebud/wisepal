export const setToken = (state, token) => {
    state.token = token
}
export const setCustomerDocuments = (state, payload) => {
    state.customerDocuments = payload
}

export const setCustomerInformation = (state, payload) => {
    state.customerInformation = payload
}

export const setSearchResults = (state, payload) => {
    state.searchResults = payload
}

export const setPlayFile = (state, payload) => {
    state.playFile = payload
}

export const appendRecordedFiles = (state, payload) => {
    state.recordedFiles.push(payload)
}

export const setRecentVisit = (state, payload) => {
    state.recentVisit = payload
}

export const setSearchFocused = (state, payload) => {
    state.searchFocused = payload
}

export const setPartyType = (state, payload) => {
    state.partyType = payload
}
