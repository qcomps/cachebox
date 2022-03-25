import {
  Field,
  SmartContract,
  state,
  State,
  UInt64,
  isReady,
  PrivateKey,
  Mina,
  Party,
  PublicKey,
  Circuit,
  Bool,
  method,
  Encoding,
  Encryption,
  Poseidon,
  Group,
  Signature,
} from 'snarkyjs';

import type { EscapeGameSnappInterface } from 'src/global';
import { StringCircuitValue } from '../snarkyUtils/String';


await isReady;

let snappPrivkey: PrivateKey;
let snappAddress: PublicKey;
let gateGroup: Group;
let labGroup: Group;

const gateKey = import.meta.env.VITE_GATE_KEY;
const labKey = import.meta.env.VITE_LAB_KEY;

class EscapeGameSnapp extends SmartContract {
  constructor(address: PublicKey) {
    super(address);
    this.gateKeyCT1 = State();
    this.gateKeyCT2 = State();
    this.labKeyCT1 = State();
    this.labKeyCT2 = State();
  }

  async deploy(initialBalance: UInt64, gateKeyCT: Field[], labKeyCT: Field[]) {
    super.deploy();
    this.balance.addInPlace(initialBalance);

    console.assert(gateKeyCT.length == 2, 'gate ciphertext not the correct size')
    console.assert(labKeyCT.length == 2, 'lab ciphertext not the correct size')

    this.gateKeyCT1.set(gateKeyCT[0]);
    this.gateKeyCT2.set(gateKeyCT[1]);

    this.labKeyCT1.set(labKeyCT[0]);
    this.labKeyCT2.set(labKeyCT[1]);
  }

  async guessGateKey(guessedKey: string, decryptionKey: Group, user: PublicKey) {
    const gateKeyCT1: Field = await this.gateKeyCT1.get();
    const gateKeyCT2: Field = await this.gateKeyCT2.get();

    const gateKeyDecrypted = Encryption.decrypt({ publicKey: decryptionKey, cipherText: [gateKeyCT1, gateKeyCT2] }, snappPrivkey);
    const guessedKeyFields = Encoding.Bijective.Fp.fromString(guessedKey);

    gateKeyDecrypted[0].assertEquals(guessedKeyFields[0])

    const msg = [user.g.x, user.g.y, Field(1)]; // this user beat puzzle 1
    const sig = Signature.create(snappPrivkey, msg);
    return sig;
  }

  async guessLabKey(guessedKey: string, decryptionKey: Group, user: PublicKey) {
    const labKeyCT1: Field = await this.labKeyCT1.get();
    const labKeyCT2: Field = await this.labKeyCT2.get();

    const labKeyDecrypted = Encryption.decrypt({ publicKey: decryptionKey, cipherText: [labKeyCT1, labKeyCT2] }, snappPrivkey);
    const guessedKeyFields = Encoding.Bijective.Fp.fromString(guessedKey);

    labKeyDecrypted[0].assertEquals(guessedKeyFields[0])

    const msg = [user.g.x, user.g.y, Field(3)]; // this user beat puzzle 3
    const sig = Signature.create(snappPrivkey, msg);
    return sig;
  }
}

// manually apply decorators:

// @state(Field) gateKey
state(Field)(EscapeGameSnapp.prototype, 'gateKeyCT1');
state(Field)(EscapeGameSnapp.prototype, 'gateKeyCT2');
state(Field)(EscapeGameSnapp.prototype, 'labKeyCT1');
state(Field)(EscapeGameSnapp.prototype, 'labKeyCT2');

// @method
Reflect.metadata('design:paramtypes', [String])(EscapeGameSnapp.prototype, 'guessGateKey');
method(EscapeGameSnapp.prototype, 'guessGateKey');

Reflect.metadata('design:paramtypes', [String])(EscapeGameSnapp.prototype, 'guessLabKey');
method(EscapeGameSnapp.prototype, 'guessLabKey');

export async function deploy() {
  snappPrivkey = PrivateKey.random();
  snappAddress = snappPrivkey.toPublicKey();
  const snapp = new EscapeGameSnapp(snappAddress);

  const snappInterface: EscapeGameSnappInterface = {
    guessGateKey(key: string) {
      return guessGateKey(snappAddress, key);
    },
    guessUnlabeledPw(key: string) {
      return guessLabKey(snappAddress, key);
    },
    guessLabKey(key: string) {
      return guessLabKey(snappAddress, key);
    },
    address: snappAddress,
  };

  const tx = Mina.transaction(DEPLOYER_ACCOUNT, async () => {
    console.log('Deploying Escape Game Snapp...');
    const p = await Party.createSigned(USER_ACCOUNT);

    const gateKeyFields = Encoding.Bijective.Fp.fromString(gateKey);
    const gateKeyCT = Encryption.encrypt(gateKeyFields, snappAddress);
    gateGroup = gateKeyCT.publicKey;

    const labKeyFields = Encoding.Bijective.Fp.fromString(labKey);
    const labKeyCT = Encryption.encrypt(labKeyFields, snappAddress);
    labGroup = labKeyCT.publicKey;

    p.balance.subInPlace(ONE_MINA);
    await snapp.deploy(ONE_MINA, gateKeyCT.cipherText, labKeyCT.cipherText)
    console.log(snapp);
  });
  await tx.send().wait();
  await Mina.getAccount(snappAddress);

  console.log('Deployed...')
  return snappInterface;
}

export async function guessGateKey(snappAddress: PublicKey, key: string) {
  const snapp = new EscapeGameSnapp(snappAddress);
  const user = PublicKey.fromPrivateKey(USER_ACCOUNT);

  console.log(`Guessing Key ${key}...`);
  let resp;
  try {
    resp = await snapp.guessGateKey(key, gateGroup, user);
  } catch (err) {
    return null
  }

  return resp;
}

export async function guessUnlabeledPw(snappAddress: PublicKey, key: string) {
  const snapp = new EscapeGameSnapp(snappAddress);
  console.log(`Guessing Key ${key}...`);
  const user = PublicKey.fromPrivateKey(USER_ACCOUNT);

  console.log(`Guessing Key ${key}...`);
  let resp;
  try {
    resp = await snapp.guessLabKey(key, labGroup, user);
  } catch (err) {
    console.log(err);
    return null
  }

  return resp;
}

export async function guessLabKey(snappAddress: PublicKey, key: string) {
  const snapp = new EscapeGameSnapp(snappAddress);
  console.log(`Guessing Key ${key}...`);
  const user = PublicKey.fromPrivateKey(USER_ACCOUNT);

  console.log(`Guessing Key ${key}...`);
  let resp;
  try {
    resp = await snapp.guessLabKey(key, labGroup, user);
  } catch (err) {
    console.log(err);
    return null
  }

  return resp;
}

export async function load() {
  await isReady;
}

export { EscapeGameSnapp };

/*
Local MINA blockchain config for the purposes of running dev.

This code is not a replacement for, nor does it interact with the MINA blockchain mainnet.
*/

let Local;
let accounts: PrivateKey[];
let DEPLOYER_ACCOUNT: PrivateKey;
let USER_ACCOUNT: PrivateKey;
let ONE_MINA: UInt64;

isReady.then(() => {
  Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  accounts = Local.testAccounts.map(account => account.privateKey);
  DEPLOYER_ACCOUNT = accounts[0];
  USER_ACCOUNT = accounts[1];
  ONE_MINA = UInt64.fromNumber(1000000);
})

