// basic
// bundles config, cache and network.
import { Environment, Network, RecordSource, Store } from "relay-runtime";

// network
function fetchQuery(operation, variables, cacheConfig, uploadables) {
    return fetch("/graphql", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(response => {
        return response.json();
    });
}

const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);
// const handlerProvider = null;

export default new Environment({
    // handlerprovider,
    network,
    store
});
