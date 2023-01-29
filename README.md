# pyt-pos

pyt-pos is a library to generate and verify pan-y-tomate Proof of Solvency. You only need to provide a csv file that contains the list of your users and their balance for a specific token. The library contains the apis to generate a proof of solvency for each user and verify it. 

## Usage

The CLI comprises of three execs:

**`init-mst`**

```bash
$ node src/cli init-mst data.csv mst.json
```

Parse the csv file provided as input (`data.csv`) into a Merkle Sum Tree and saves it in a json file provided as output `mst.json`. The csv file should be in the format of `userID,balance` (see [test/data.csv](./test/data.csv) for example).

**`gen-proof`**

```bash
$ node src/cli gen-proof mst.json proof.json public.json 1 2000
```

Starting from the data structure provided as input (`mst.json`), generate a proof for the user with index `1` in the csv file. The total assets held by the exchange is `2000`.
The proof is saved in a json file provided as output (`proof.json`). The public signals is also saved in a json file provided as output (`public.json`)

> Note that the `index` is not the same as the `userID`. The `index` is the position of the user in the csv file. The first user will have index 0, an so on... The `userID` is the value of the first column of the csv file.

The proof is generated using the artificats generated by the trusted setup executed by the pan-y-tomate team. The artifacts are located in the `artifacts` folder.

**`verify-proof`**

```bash
$ node src/cli verify-proof proof.json public.json
```

Starting from the proof provided as input (`proof.json`) and the public signals provided as input (`public.json`), the user can verify their own proof. The user is still required to check whether the public signals are correct. This is an exampel of the output of a succesfully verified proof:

```bash
Verification OK
Does this match the public root hash? 10282595180566643423269555543735649507136102163748745566772565484813750476731
Does this match the total assets owned by the CEX? 10000
Does this match the poseidon hash of your used ID and your balance? 1775921064485816613880388139942630078405276839580141761238454556829307809371
Does this match your balance in the exchange? 665
```

## Core Deps

- [ts-merkle-sum-tree](https://github.com/pan-y-tomate/ts-merkle-sum-tree), APIs to create merkle sum tree in Typescript
- [zk-prover](https://github.com/pan-y-tomate/zk-prover), zkSNARK proving system for Proof Of Solvency.

## Test 

```bash
$ npm run test
```

//    * Verifies the public signals of the proof of solvency generated for a specific user. It only verifies that the public signals (leaf hash, root hash and assets sum) matches the expected values.
//    * It checks that 
//    * 1. The proof was generated for the correct user
//    * 2. The root hash of the Merkle Sum Tree used as public input for the proof generation matches the one published by the exchange
//    * 3. The assetsSum used as public input for the proof generation matches the one published by the exchange


### To DO 

- [x] Write In-Line comments
- [ ] Write docs, explain leaf hash and stuff like this. Make reference to the circuit itself
- [ ] Brainstorm possible tests!
- [ ] Add reference to CLI!
- [ ] Modify reference to mst and circuits repos
- [ ] Better create the ts package
- [ ] Add Description to each function
- [ ] Prettify Everything
- [ ] Handle Errors in Proof Verification
- [ ] Check usage of circomlibjs
- [ ] Update mst package version

### Testing
- [ ] Providing wrong artifcats 

