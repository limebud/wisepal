export const setToken = (state, token) => {
    state.token = token
}
export const setCustomerDocuments = (state, payload) => {
    state.customerDocuments = payload
}

export const setCustomerInformation = (state, payload) => {
    state.customerInformation = payload
}

export const setPlayFile = (state, payload) => {
    state.playFile = payload
}

export const appendRecordedFiles = (state, payload) => {
    state.recordedFiles.push(payload)
}
