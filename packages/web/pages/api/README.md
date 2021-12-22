# API

`/api` cloud function endpoints.

### `/api/claim`

Claims and mints a new fragment for the declared recipient matching given keyphrase.

**Request**

- Method: `POST`
- Content-Type: `application/json`
- Body:
  - `to`: address of recipient
  - `key`: `keccak256(keyphrase)`

**Response**

- Content-Type: `application/json`
- Body:
  - `tokenId`: tokenId minted
  - `tx`: transaction hash for mint

### `/api/claimed/[key]`

Check whether a given key (`keccak256(keyphrase)`) has already been claimed. Provides "false negatives" in that it does not check for whether the keyphrase was valid in the first place.

**Request**

- Method: `GET`
- Params:
  - `key`: assumed to be `bytes32` (keccak256 hash)

**Response**

- Content-Type: `application/json`
- Body:
  - `claimed`: whether `key` was already claimed

### `/api/fragments`

Query for all claimed fragments (as token ids) of the NFT collection.

**Request**

- Method: `GET`

**Response**

- Content-Type: `application/json`
- Body:
  - `tokens`: array of all token ids already claimed

### `/api/fragment/[addr]`

Query for all fragments (as token ids) held by a given wallet.

**Request**

- Method: `GET`
- Params:
  - `addr`: address of given wallet

**Response**

- Content-Type: `application/json`
- Body:
  - `tokens`: array of token ids held by given wallet
