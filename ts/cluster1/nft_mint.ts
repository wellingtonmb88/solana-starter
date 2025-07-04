import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/turbin3-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = await createNft(umi, {
    mint,
    name: "My Fucking Rug Pull NFT",
    symbol: "MYRUG",
    uri: "https://gateway.irys.xyz/ALLapzxbQeKuD6e9H5Erp7UCfdkLqHBKHB9BkgvAt6ao",
    sellerFeeBasisPoints: percentAmount(5),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
  console.log("Mint Address: ", mint.publicKey);

  /*
  https://explorer.solana.com/tx/22KfqEnSxag92KA7peogvQY9djqEXM8XYDxaxR99fH3uCt1z2UkXN4ViMSRbAcDpVhSe48iDegqSdDRQRpVowRvS?cluster=devnet
  Mint Address:  2Ln2BftrdTvE5Z42jGjdyvZE9qYuh7bNqDi84arQgmhq 
  */
})();
