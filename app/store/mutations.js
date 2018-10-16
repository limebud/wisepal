
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

export const setReadFile = (state, payload) => {
    state.readFile = payload
}

export const appendRecordedFiles = (state, payload) => {
    state.recordedFiles.push(payload)
}

export const appendNotes = (state, payload) => {
    if (!state.notes.includes(payload)) {
        state.notes.push(payload)
    }
}

export const emptyRecordedFiles = (state) => {
    state.recordedFiles = []
}

export const emptyNotes = (state) => {
    state.notes = []
}

export const removeNoteFromArray = (state, payload) => {
    let index = state.notes.indexOf(payload)
    state.notes.splice(index, 1)
}

export const removeRecordingFromArray = (state, payload) => {
    let index = state.recordedFiles.indexOf(payload)
    state.recordedFiles.splice(index, 1)
}

export const setRecentVisit = (state, payload) => {
    state.recentVisit = payload
}

export const setSearchBarActive = (state, payload) => {
    state.searchBarActive = payload
}

export const setPartyType = (state, payload) => {
    state.partyType = payload
}
