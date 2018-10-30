import axios from 'axios'
import * as Toast from 'nativescript-toast';
import * as fs from 'tns-core-modules/file-system'
import * as appSettings from 'tns-core-modules/application-settings'


export const authRequest = ({commit}, auth) => {
    axios.get('https://webapitest.wisetalk.se/api/Account/BrokerLogin/', {
        params: {
            pin: auth.pin,
            username: auth.username,
            password: auth.password
        }
    })
    .then(res => {
        if (res.data.Success) {
            commit('setToken', res.data.ClientToken)

            appSettings.setString("pin", auth.pin)
            appSettings.setString("username", auth.username)
            appSettings.setString("token", res.data.ClientToken)

        } else {
            Toast.makeText(res.data.Messages[0], "long").show()
        }
    })
    .catch((err) => {
        console.log("Error: " + err )
    })
}

export const recentVisit = async ({commit, state}) => {
    await axios.get('https://webapitest.wisetalk.se/api/Broker/GetRecentVisit', {
        headers: {
            'Authorization': state.token,
            'Culture': 'sv-se'
        }
    }).
    then(res => {
        if (res.data.Success) {
            commit('setRecentVisit', res.data.Result)
        } else {
            console.log(res.data.Messages[0])
        }
    })
    .catch((err) => {
        console.log("Error: " + err)
    })
}

export const goToCustomer = async ({commit, state}, payload) => {
    await axios.all([
        axios.get(payload.url, {
            params: {
                Id: payload.id
            },
            headers: {
                'Authorization': state.token,
                'Culture': 'sv-se',
            }
        }),
        axios.post('/Broker/SaveRecentVisit/?partyId=' + payload.id, {}, {
            headers: {
                'Authorization': state.token,
                'Culture': 'sv-se',
            }
        })
    ])
    .then(axios.spread((personRes) => {
        commit('setCustomerInformation', personRes.data.Result)
    }))
    .catch(error => {
        console.log("Error: " + error.response.data.Message)
    })

}

export const search = ({commit, state}, payload) => {
        axios.get('/Broker/SearchParties/', {
            params: {
                searchQuery: payload.searchQuery
            },
            headers: {
                'Authorization': state.token,
                'Culture': 'sv-se'
            }
        })
        .then(res => {
            commit('setSearchResults', res.data.Result)
        })
        .catch(error => { console.log("Eh: " + error)})
}

export const getDocuments = async ({commit, state}, payload) => {
    await axios.get('/Document/GetDocumentsByPartyId/', {
        params: {
            Id: payload.id
        },
        headers: {
            'Authorization': state.token,
            'Culture': 'sv-se'
        }
    })
    .then(res => {
        commit('setCustomerDocuments', res.data.Result)
    })
}

export const getFiles = ({commit}, payload) => {
    let folder = fs.knownFolders.currentApp().getFolder(payload.folder + '/' + payload.id)
    folder.getEntities()
    .then(entities => {
        entities.forEach(entity => {
            if (payload.folder === 'recordings') {
                commit('appendRecordedFiles', entity.name)
            } else if (payload.folder === 'notes') {
                commit('appendNotes', entity.name)
            }
        })
    })
}
