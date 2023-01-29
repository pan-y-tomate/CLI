import { IncrementalMerkleSumTree } from 'pyt-merkle-sum-tree';
import { FullProof, SnarkProverArtifacts } from './types/index';
import _generateProof from './generateProof';
import _verifyPublicSignals from './verifyPublicSignals';
import _verifyZkProof from './verifyZkProof';

/**
 * PytPos is a class that contains the core methods to let CEXs provide credible Proof Of Solvency to its users
 * while maintaining secrecy over their Business Information thanks to zkSNARKs.
 * The exchange first needs to create a Merkle Sum Tree from a csv file containing the username and balances of its users.
 * Then, it can generate a proof of solvency for a specific user using a zkSNARK.
 * The proof of solvency is generated by providing the Merkle Sum Tree, the user's index in the Merkle Sum Tree, the total assets owned by the exchange and the prover artifacts.
 * The proof doesn't reveal information such as the total balances of each users, the number of users and total amount of liabilities are not revealed to the public.
 * The PytPos class also provides methods such that the user can verify the zk proof of solvency and the public signals of the proof.
 */

export default class PytPos {
  /**
   * Creates a Merkle Sum Tree from a csv file containing the username and balances of the users.
   * @param pathToCsv The path to the csv file containing the username and balances of the users.
   * @returns An instance of the IncrementalMerkleSumTree class.
   */
  static createMerkleSumTree(pathToCsv: string): IncrementalMerkleSumTree {
    return new IncrementalMerkleSumTree(pathToCsv);
  }

  /**
   * Generates a proof of solvency for a specific user using a zkSNARK.
   * @param merkleSumTree An instance of the IncrementalMerkleSumTree class.
   * @param userIndex The index of the user in the Merkle Sum Tree.
   * @param assetsSum The total assets owned by the exchange.
   * @param proverArtifacts The prover artifacts.
   * @returns A FullProof object containing the proof of solvency. It contains the zk proof and the public signals of the proof, namely the leaf hash, the root hash and the assets sum.
   */
  static async generateProofOfSolvency(
    merkleSumTree: IncrementalMerkleSumTree,
    userIndex: number,
    assetsSum: bigint,
    proverArtifacts: SnarkProverArtifacts,
  ): Promise<FullProof> {
    return await _generateProof(merkleSumTree, userIndex, assetsSum, proverArtifacts);
  }

  /**
   * Verifies the zk proof of solvency generated for a specific user. It only verifies the validity of the zk proof. It doesn't verify that the public signals (leaf hash, root hash and assets sum) matches the expected values.
   * @param proof A FullProof object containing the proof of solvency. It contains the zk proof and the public signals of the proof, namely the leaf hash, the root hash and the assets sum.
   * @param verificationKey The verification key.
   * @returns A boolean indicating whether the zk proof is valid or not.
   */
  static verifyZkProof(proof: FullProof, verificationKey: JSON): boolean {
    return _verifyZkProof(proof, verificationKey);
  }

  /**
   * Verifies the public signals of the proof of solvency generated for a specific user. It only verifies that the public signals (leaf hash, root hash and assets sum) matches the expected values.
   * It checks that 
   * 1. The proof was generated for the correct user
   * 2. The root hash of the Merkle Sum Tree used as public input for the proof generation matches the one published by the exchange
   * 3. The assetsSum used as public input for the proof generation matches the one published by the exchange
   * @param proof A FullProof object containing the proof of solvency. It contains the zk proof and the public signals of the proof, namely the leaf hash, the root hash and the assets sum.
   * @param username The username of the user is verifying the proof
   * @param balance The balance of the user is verifying the proof
   * @param expectedMerkleTreeRoot The root hash of the Merkle Sum Tree published by the exchange
   * @param expectedAssetsSum The total assets owned by the exchange published by the exchange
   * @returns A boolean indicating whether the public signals of the proof are valid or not.
   */
  static verifyPublicSignals(
    proof: FullProof,
    username: string,
    balance: bigint,
    expectedMerkleTreeRoot: bigint,
    expectedAssetsSum: bigint,
  ): boolean {
    return _verifyPublicSignals(proof, username, balance, expectedMerkleTreeRoot, expectedAssetsSum);
  }
}