// 1st category of testing => MT creation

import shell from 'shelljs';
import { expect } from 'chai';
import fs from 'fs'
import getCSVEntries from '../utils/csv.js';
import { IncrementalMerkleSumTree } from "ts-merkle-sum-tree"
import { poseidon } from "circomlibjs"

describe('POS CLI', () => {

  describe('init-mst', () => {

    let csvFile;
    let mstFile;
    let entries;
    let parsedMst;

    beforeEach(async function () {

      csvFile = 'test/data.csv';
      mstFile = 'test/merkletree.json';  

      // exec the command with the csv file as inputFile and the mst file as outputFile
      shell.exec(`node src/cli.js init-mst ${csvFile} ${mstFile}`);

      // parse the entries from the csv file
      entries = getCSVEntries(csvFile);

      // parse the json file
      parsedMst = JSON.parse(fs.readFileSync(mstFile, 'utf8'));
    });

    it('should create a mst file in json', () => {
      // check if the file is created
      expect(fs.existsSync(mstFile)).to.be.true;
    });
  
    it('should create a mst that contain the correct number of entries', () => {
      // expect the tree to contain the same number of entries as the csv file
      expect(parsedMst._nodes[0].length).to.equal(entries.length);
    });
  
    it('should create a mst that contain the right values', () => {
    
      // expect the entries to match 
      for (let i = 0; i < entries.length; i++) {
        expect(parsedMst._nodes[0][i].sum).to.equal(entries[i].balance);
      }
    });
  
    it('should create a mst that contains the right root sum', () => {
      
      // get the root sum from the mst
      const rootSum = parsedMst._root.sum;
  
      // loop over the entries and get the sum of all the balances
      let sum = 0;
      for (let i = 0; i < entries.length; i++) {
        sum += parseInt(entries[i].balance);
      }
      // expect the root sum to be equal to the sum of all the balances
      expect(parseInt(rootSum)).to.equal(sum);
    });

  });

  describe('gen-proof', () => {

    let proofFile;
    let mstFile;
    let index; 
    let targetSum;
    let parsedMst;
    let parsedProof;

    beforeEach(async function () {

      mstFile = 'test/merkletree.json';  
      proofFile = 'test/proof.json';  

      // parse the merkle tree file
      parsedMst = JSON.parse(fs.readFileSync(mstFile, 'utf8'));

      index = 5
      targetSum = 1000

      // exec the command with the csv file as inputFile and the mst file as outputFile
      shell.exec(`node src/cli.js gen-proof ${mstFile} ${proofFile} ${index} ${targetSum}`);

      // parse the proof file
      parsedProof = JSON.parse(fs.readFileSync(proofFile, 'utf8'));

    });

    it('should create a proof file in json', () => {
      // check if the file is created
      expect(fs.existsSync(proofFile)).to.be.true;
    });

    it('Should generate a proof same as the one that would be generated using the library methods on the tree object', () => {

      // get the entries from the csv file
      const csvFile = 'test/data.csv';
      const entries = getCSVEntries(csvFile);

      // create a merkle tree from the entries 
      const tree = new IncrementalMerkleSumTree(poseidon, 16);

      // insert the entries in the tree
      for (let i = 0; i < entries.length; i++) {
        tree.insert(BigInt(entries[i].userID), BigInt(entries[i].balance));
      }

      console.log(tree._nodes[0])

      // get the proof from the tree
      const proof = tree.createProofWithTargetSum(index, targetSum);

      shell.exec(`node src/cli.js gen-proof ${mstFile} ${proofFile} ${index} ${targetSum}`);
      
      // expect the proof to be the same as the one generated by the library
      expect(parsedProof).to.deep.equal(proof);
    });
  

  });

});


// 2nd category of testing => MT proof creation

// Should throw an error if the index doesn't exist in the tree
// Should generate a proof same as the one that would be generated using the library methods on the tree object